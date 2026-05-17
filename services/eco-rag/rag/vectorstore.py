import os
import logging
from pathlib import Path
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from config import settings

logger = logging.getLogger(__name__)

_vectorstore: Chroma | None = None


def _get_chromadb_embeddings():
    """Use ChromaDB's built-in ONNX embedding function (all-MiniLM-L6-v2, local, no network)."""
    from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2
    return ONNXMiniLM_L6_V2()


class ChromaDBEmbeddingAdapter:
    """Adapts ChromaDB's embedding function to LangChain's interface."""

    def __init__(self):
        self._fn = _get_chromadb_embeddings()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self._fn(texts)

    def embed_query(self, text: str) -> list[float]:
        return self._fn([text])[0]


_embedding_adapter: ChromaDBEmbeddingAdapter | None = None


def get_embeddings() -> ChromaDBEmbeddingAdapter:
    global _embedding_adapter
    if _embedding_adapter is None:
        logger.info("Initializing ChromaDB ONNX embeddings (all-MiniLM-L6-v2, local)")
        _embedding_adapter = ChromaDBEmbeddingAdapter()
    return _embedding_adapter


def _load_knowledge_base() -> list:
    kb_dir = Path(settings.knowledge_base_dir)
    if not kb_dir.exists():
        logger.warning("Knowledge base directory not found: %s", kb_dir)
        return []

    loader = DirectoryLoader(
        str(kb_dir),
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=False,
        use_multithreading=False,
    )
    docs = loader.load()
    logger.info("Loaded %d raw documents from knowledge base", len(docs))

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(docs)

    for chunk in chunks:
        src = chunk.metadata.get("source", "")
        chunk.metadata["source_file"] = Path(src).stem if src else "unknown"
        chunk.metadata["source_type"] = _classify_source(Path(src).stem if src else "")

    logger.info("Split into %d chunks", len(chunks))
    return chunks


def _classify_source(filename: str) -> str:
    mapping = {
        "climate_science": "IPCC Climate Science",
        "air_quality_standards": "Air Quality Guidelines",
        "disaster_response": "Disaster Response Protocols",
        "ecosystems_biodiversity": "Ecosystems & Biodiversity",
        "health_environmental": "Environmental Health",
        "wildfire_protocols": "Wildfire Science & Response",
        "ocean_sea_level": "Ocean Systems & Sea Level",
    }
    for key, label in mapping.items():
        if key in filename:
            return label
    return "Environmental Research"


def get_vectorstore(force_rebuild: bool = False) -> Chroma:
    global _vectorstore
    if _vectorstore is not None and not force_rebuild:
        return _vectorstore

    persist_dir = settings.chroma_persist_dir
    embeddings = get_embeddings()

    if os.path.exists(persist_dir) and not force_rebuild:
        existing = os.listdir(persist_dir)
        if existing:
            logger.info("Loading existing vector store from %s", persist_dir)
            _vectorstore = Chroma(
                persist_directory=persist_dir,
                embedding_function=embeddings,
                collection_name="ecosentinels_kb",
            )
            count = _vectorstore._collection.count()
            logger.info("Loaded vector store with %d documents", count)
            if count > 0:
                return _vectorstore

    logger.info("Building vector store from knowledge base...")
    os.makedirs(persist_dir, exist_ok=True)
    chunks = _load_knowledge_base()

    if not chunks:
        logger.error("No documents found to build vector store")
        _vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings,
            collection_name="ecosentinels_kb",
        )
        return _vectorstore

    _vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir,
        collection_name="ecosentinels_kb",
    )
    logger.info("Vector store built with %d chunks", len(chunks))
    return _vectorstore


def get_retriever(k: int | None = None):
    vs = get_vectorstore()
    return vs.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": k or settings.retrieval_k,
            "fetch_k": (k or settings.retrieval_k) * 3,
            "lambda_mult": 0.7,
        },
    )


def format_docs(docs) -> str:
    parts = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source_type", "Environmental Research")
        parts.append(f"[Source {i} - {source}]\n{doc.page_content}")
    return "\n\n---\n\n".join(parts)


def get_doc_count() -> int:
    try:
        vs = get_vectorstore()
        return vs._collection.count()
    except Exception:
        return 0
