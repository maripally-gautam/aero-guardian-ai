"""
========================================================
  RAG QUERY ENGINE
  -------------------------------------------------------
  Loads the FAISS vector database, performs similarity
  search on user queries, and sends retrieved context
  to Google Gemini for answer generation.
========================================================
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


# Load environment variables
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# ──────────────────────────────────────────────
#  Configuration
# ──────────────────────────────────────────────

VECTOR_STORE_DIR = Path(__file__).resolve().parent / "vector_store"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 4                  # Number of chunks to retrieve
GEMINI_MODEL = "gemini-2.5-flash"

# RAG prompt template
RAG_PROMPT = PromptTemplate.from_template("""
You are AeroGuardian AI, an expert aircraft maintenance assistant.
You help aviation technicians with diagnostics, troubleshooting,
and maintenance procedures using official aircraft manuals.

Use ONLY the following context from aircraft maintenance manuals
to answer the question. If the context doesn't contain enough
information to answer, say so honestly and suggest what documentation
to consult.

Be specific, technical, and safety-conscious in your answers.
Use bullet points and numbered steps where appropriate.

Context:
{context}

Question:
{input}

Provide a clear, detailed, and technically accurate answer:
""")


class RAGQueryEngine:
    """
    The core RAG engine that handles:
    1. Loading the FAISS vector database
    2. Converting queries to embeddings
    3. Retrieving relevant document chunks
    4. Generating answers via Gemini LLM
    """

    def __init__(self):
        self._vector_store: Optional[FAISS] = None
        self._embeddings: Optional[HuggingFaceEmbeddings] = None
        self._llm: Optional[ChatGoogleGenerativeAI] = None
        self._initialized = False

    def initialize(self) -> bool:
        """
        Load all components into memory.
        Called once at startup; subsequent calls are no-ops.
        """
        if self._initialized:
            return True

        # ── Validate API key ──
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("  ✗ GOOGLE_API_KEY not found in environment variables.")
            print("    Add it to the .env file in the project root.")
            return False

        # ── Validate vector store ──
        index_path = VECTOR_STORE_DIR / "index.faiss"
        if not index_path.exists():
            print(f"  ✗ Vector store not found at {VECTOR_STORE_DIR}")
            print("    Run 'python ingest_docs.py' first to build the index.")
            return False

        print("  Loading RAG Query Engine...")

        # ── Step 1: Load embedding model ──
        print(f"  → Embedding model: {EMBEDDING_MODEL}")
        self._embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

        # ── Step 2: Load FAISS vector store ──
        print(f"  → Loading FAISS index from {VECTOR_STORE_DIR}")
        self._vector_store = FAISS.load_local(
            str(VECTOR_STORE_DIR),
            self._embeddings,
            allow_dangerous_deserialization=True,  # Required for loading pickled data
        )

        # ── Step 3: Initialize Gemini LLM ──
        print(f"  → LLM: Google Gemini ({GEMINI_MODEL})")
        self._llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            google_api_key=api_key,
            temperature=0.3,           # Lower temp for factual answers
            max_output_tokens=2048,
        )

        self._initialized = True
        print("  ✅ RAG Query Engine ready!\n")
        return True

    def query(self, question: str) -> dict:
        """
        Process a user question through the full RAG pipeline:
        1. Embed the question
        2. Retrieve top-K relevant chunks from FAISS
        3. Send context + question to Gemini
        4. Return answer with source citations

        Returns:
            {
                "answer": str,
                "sources": [str],
                "chunks_used": int
            }
        """
        if not self._initialized:
            raise RuntimeError("Query engine not initialized. Call initialize() first.")

        # ── Step 1: Similarity search ──
        retrieved_docs = self._vector_store.similarity_search(
            query=question,
            k=TOP_K,
        )

        if not retrieved_docs:
            return {
                "answer": "I couldn't find relevant information in the maintenance manuals for your question. Please try rephrasing or consult the specific aircraft manual directly.",
                "sources": [],
                "chunks_used": 0,
            }

        # ── Step 2: Extract source citations ──
        sources = []
        seen = set()
        for doc in retrieved_docs:
            source_file = doc.metadata.get("source_file", "Unknown")
            page_num = doc.metadata.get("page_number", doc.metadata.get("page", "?"))
            citation = f"{source_file} — page {page_num}"
            if citation not in seen:
                sources.append(citation)
                seen.add(citation)

        # ── Step 3: Build context string from retrieved chunks ──
        context_text = "\n\n---\n\n".join(
            f"[Source: {doc.metadata.get('source_file', 'Unknown')} | Page {doc.metadata.get('page_number', '?')}]\n{doc.page_content}"
            for doc in retrieved_docs
        )

        # ── Step 4: Generate answer with Gemini ──
        try:
            prompt_text = RAG_PROMPT.format(context=context_text, input=question)
            response = self._llm.invoke(prompt_text)
            answer = response.content if hasattr(response, 'content') else str(response)
        except Exception as e:
            print(f"  ✗ Gemini API error: {e}")
            return {
                "answer": f"I encountered an error generating the answer: {str(e)}. The relevant manual sections were found — please try again.",
                "sources": sources,
                "chunks_used": len(retrieved_docs),
            }

        return {
            "answer": answer,
            "sources": sources,
            "chunks_used": len(retrieved_docs),
        }


# ──────────────────────────────────────────────
#  Singleton instance (cached in memory)
# ──────────────────────────────────────────────
_engine: Optional[RAGQueryEngine] = None


def get_query_engine() -> RAGQueryEngine:
    """
    Returns a singleton RAGQueryEngine instance.
    The vector database and models are cached in memory
    for fast retrieval on subsequent queries.
    """
    global _engine
    if _engine is None:
        _engine = RAGQueryEngine()
        _engine.initialize()
    return _engine
