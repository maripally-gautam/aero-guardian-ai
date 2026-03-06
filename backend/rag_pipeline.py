"""
========================================================
  RAG PIPELINE — Central Module
  -------------------------------------------------------
  Orchestrates the full RAG pipeline:
  - Auto-ingestion on first run
  - Query processing
  - Health checks
========================================================
"""

from pathlib import Path
from ingest_docs import ingest, VECTOR_STORE_DIR, DOCS_DIR
from query_engine import get_query_engine, RAGQueryEngine


def ensure_vector_store() -> bool:
    """
    Ensure the vector store exists.
    If not, automatically run the ingestion pipeline.
    Returns True if ready, False if ingestion failed.
    """
    index_path = VECTOR_STORE_DIR / "index.faiss"

    if index_path.exists():
        print("  ✓ Vector store found. Skipping ingestion.")
        return True

    print("  ℹ️  No vector store found. Starting automatic ingestion...")
    return ingest(force=False)


def get_pipeline_status() -> dict:
    """
    Return current health/status of the RAG pipeline.
    Useful for frontend health checks.
    """
    index_exists = (VECTOR_STORE_DIR / "index.faiss").exists()
    docs_dir_exists = DOCS_DIR.exists()
    pdf_count = len(list(DOCS_DIR.glob("*.pdf"))) if docs_dir_exists else 0

    return {
        "vector_store_ready": index_exists,
        "docs_directory": str(DOCS_DIR),
        "pdf_count": pdf_count,
        "vector_store_path": str(VECTOR_STORE_DIR),
        "status": "ready" if index_exists else "needs_ingestion",
    }
