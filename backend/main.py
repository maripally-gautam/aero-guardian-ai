"""
========================================================
  AEROGUARDIAN RAG — FastAPI Server
  -------------------------------------------------------
  Main API server exposing the RAG pipeline.

  Endpoints:
    POST /ask        — Ask a question to the RAG system
    GET  /health     — Check pipeline status
    POST /ingest     — Manually trigger document ingestion

  Run with:
    uvicorn main:app --reload --port 8000
========================================================
"""

import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# ── Load environment variables ──
# Look for .env in both backend/ and project root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Also try backend-local .env
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

# ── Import RAG components ──
from rag_pipeline import ensure_vector_store, get_pipeline_status
from query_engine import get_query_engine


# ──────────────────────────────────────────────
#  Lifespan: run startup/shutdown logic
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    On startup:
    1. Check if vector store exists; if not, auto-ingest
    2. Load the RAG query engine into memory
    """
    print("\n" + "=" * 60)
    print("  🛩️  AEROGUARDIAN RAG SERVER STARTING")
    print("=" * 60 + "\n")

    # Step 1: Ensure vector store is built
    store_ready = ensure_vector_store()

    if store_ready:
        # Step 2: Pre-load the query engine into memory
        try:
            engine = get_query_engine()
            print("  ✅ Server ready to accept queries!\n")
        except Exception as e:
            print(f"  ⚠️  Query engine init failed: {e}")
            print("     Server will still start but /ask may fail.\n")
    else:
        print("  ⚠️  Vector store not available.")
        print("     Place PDFs in backend/docs/ and POST to /ingest\n")

    yield  # Server is running

    # Shutdown
    print("\n  🛩️  AeroGuardian RAG Server shutting down.\n")


# ──────────────────────────────────────────────
#  FastAPI App
# ──────────────────────────────────────────────
app = FastAPI(
    title="AeroGuardian RAG API",
    description="RAG-powered aircraft maintenance assistant API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS — allow frontend to call the API ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:5173",
        "http://localhost:3000",
        "*",  # In production, restrict this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
#  Request / Response Models
# ──────────────────────────────────────────────
class AskRequest(BaseModel):
    question: str

    class Config:
        json_schema_extra = {
            "example": {
                "question": "Why does engine vibration increase during climb?"
            }
        }


class AskResponse(BaseModel):
    answer: str
    sources: list[str]
    chunks_used: int


class HealthResponse(BaseModel):
    vector_store_ready: bool
    docs_directory: str
    pdf_count: int
    vector_store_path: str
    status: str


class IngestResponse(BaseModel):
    success: bool
    message: str


# ──────────────────────────────────────────────
#  Endpoints
# ──────────────────────────────────────────────

@app.post("/ask", response_model=AskResponse, tags=["RAG"])
async def ask_question(request: AskRequest):
    """
    Ask a question about aircraft maintenance.

    The RAG pipeline will:
    1. Search the vector database for relevant manual sections
    2. Send the context to Gemini LLM
    3. Return an AI-generated answer with source citations
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        engine = get_query_engine()
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"RAG engine not available: {str(e)}. Run /ingest first.",
        )

    try:
        result = engine.query(request.question)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}",
        )

    return AskResponse(
        answer=result["answer"],
        sources=result["sources"],
        chunks_used=result["chunks_used"],
    )


@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Check the health and status of the RAG pipeline.
    """
    status = get_pipeline_status()
    return HealthResponse(**status)


@app.post("/ingest", response_model=IngestResponse, tags=["System"])
async def trigger_ingestion():
    """
    Manually trigger document ingestion.
    This will rebuild the vector database from PDFs in the docs/ folder.
    """
    from ingest_docs import ingest

    try:
        success = ingest(force=True)
        if success:
            # Reload the query engine with the new index
            from query_engine import _engine
            import query_engine
            query_engine._engine = None  # Reset singleton
            get_query_engine()  # Re-initialize

            return IngestResponse(
                success=True,
                message="Documents ingested successfully. Vector store rebuilt.",
            )
        else:
            return IngestResponse(
                success=False,
                message="Ingestion failed. Check that PDFs exist in the docs/ folder.",
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ingestion error: {str(e)}",
        )


# ──────────────────────────────────────────────
#  Root
# ──────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    return {
        "service": "AeroGuardian RAG API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "POST /ask": "Ask a maintenance question",
            "GET /health": "Check system status",
            "POST /ingest": "Rebuild vector database",
        },
    }
