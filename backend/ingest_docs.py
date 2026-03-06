"""
========================================================
  DOCUMENT INGESTION PIPELINE
  -------------------------------------------------------
  Reads PDFs from the docs/ folder, splits them into
  chunks, creates embeddings using sentence-transformers,
  and stores them in a FAISS vector database.
========================================================
"""

import os
import sys
import time
from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# ──────────────────────────────────────────────
#  Configuration
# ──────────────────────────────────────────────

# Directory containing the PDF manuals
DOCS_DIR = Path(__file__).resolve().parent / "docs"

# Where to save the FAISS index
VECTOR_STORE_DIR = Path(__file__).resolve().parent / "vector_store"

# Chunk splitting parameters
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Embedding model
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def load_pdfs(docs_dir: Path) -> list:
    """
    Load all PDF files from the specified directory.
    Returns a list of LangChain Document objects with metadata.
    """
    pdf_files = sorted(docs_dir.glob("*.pdf"))

    if not pdf_files:
        print(f"[WARNING] No PDF files found in {docs_dir}")
        print("          Please place your aviation manual PDFs in the docs/ folder.")
        return []

    print(f"\n{'='*60}")
    print(f"  DOCUMENT INGESTION PIPELINE")
    print(f"{'='*60}")
    print(f"\n  Found {len(pdf_files)} PDF file(s):\n")

    all_docs = []

    for pdf_path in pdf_files:
        file_size_mb = pdf_path.stat().st_size / (1024 * 1024)
        print(f"  📄 Loading: {pdf_path.name} ({file_size_mb:.1f} MB)")

        try:
            loader = PyPDFLoader(str(pdf_path))
            docs = loader.load()

            # Enrich metadata with source filename
            for doc in docs:
                doc.metadata["source_file"] = pdf_path.name

            all_docs.extend(docs)
            print(f"     ✓ Extracted {len(docs)} pages")
        except Exception as e:
            print(f"     ✗ Error loading {pdf_path.name}: {e}")

    print(f"\n  Total pages extracted: {len(all_docs)}")
    return all_docs


def split_documents(documents: list) -> list:
    """
    Split documents into smaller chunks for embedding.
    Uses RecursiveCharacterTextSplitter for intelligent splitting.
    """
    print(f"\n  Splitting documents (chunk_size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})...")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
        add_start_index=True,  # Track position within source document
    )

    chunks = splitter.split_documents(documents)

    # Add chunk IDs to metadata for citation tracking
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = i
        # Ensure page number is stored (PyPDF uses 'page' key)
        if "page" in chunk.metadata:
            chunk.metadata["page_number"] = chunk.metadata["page"] + 1  # 0-indexed → 1-indexed

    print(f"  ✓ Created {len(chunks)} chunks")
    return chunks


def create_vector_store(chunks: list, save_dir: Path) -> FAISS:
    """
    Create embeddings for all chunks and store them in FAISS.
    """
    print(f"\n  Loading embedding model: {EMBEDDING_MODEL}")
    print(f"  (This may take a moment on first run...)\n")

    # Initialize the embedding model
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},  # For cosine similarity
    )

    print(f"  Creating embeddings for {len(chunks)} chunks...")
    start_time = time.time()

    # Build FAISS index from documents
    vector_store = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings,
    )

    elapsed = time.time() - start_time
    print(f"  ✓ Embeddings created in {elapsed:.1f}s")

    # Save to disk
    save_dir.mkdir(parents=True, exist_ok=True)
    vector_store.save_local(str(save_dir))
    print(f"  ✓ Vector store saved to: {save_dir}")

    return vector_store


def ingest(force: bool = False) -> bool:
    """
    Main ingestion pipeline.
    Returns True if ingestion was performed, False if skipped.
    """
    # Check if vector store already exists
    index_file = VECTOR_STORE_DIR / "index.faiss"
    if index_file.exists() and not force:
        print(f"\n  ℹ️  Vector store already exists at {VECTOR_STORE_DIR}")
        print(f"     Skipping ingestion. Use --force to rebuild.")
        return False

    # Step 1: Load PDFs
    documents = load_pdfs(DOCS_DIR)
    if not documents:
        return False

    # Step 2: Split into chunks
    chunks = split_documents(documents)
    if not chunks:
        print("  ✗ No chunks created. Check your PDF files.")
        return False

    # Step 3: Create embeddings and build FAISS index
    vector_store = create_vector_store(chunks, VECTOR_STORE_DIR)

    print(f"\n{'='*60}")
    print(f"  ✅ INGESTION COMPLETE")
    print(f"     Documents: {len(set(c.metadata.get('source_file', '') for c in chunks))}")
    print(f"     Chunks:    {len(chunks)}")
    print(f"     Index:     {VECTOR_STORE_DIR}")
    print(f"{'='*60}\n")

    return True


# ──────────────────────────────────────────────
#  CLI Entry Point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    force = "--force" in sys.argv
    ingest(force=force)
