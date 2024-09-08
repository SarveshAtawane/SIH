import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from model import chat_with_rag, load_embeddings_from_mongodb, build_faiss_index

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str
    college_name: str
    lang: str

# Cache to store initialized FAISS indexes
college_indexes = {}

def get_or_initialize_faiss_index(college_name):
    if college_name not in college_indexes:
        logger.info(f"Initializing FAISS index for {college_name}")
        documents, embeddings = load_embeddings_from_mongodb(college_name)
        if embeddings.size == 0:
            raise ValueError(f"No embeddings found for college {college_name}")
        faiss_index = build_faiss_index(embeddings)
        college_indexes[college_name] = {
            "documents": documents,
            "faiss_index": faiss_index
        }
        logger.info(f"FAISS index initialized for {college_name}")
    return college_indexes[college_name]

@app.post("/ask_query")
async def ask_query(query: Query):
    try:
        logger.info(f"Received query: {query.query}")
        logger.info(f"College: {query.college_name}")
        logger.info(f"Language: {query.lang}")
        
        # Initialize or get the FAISS index for the specific college
        index_data = get_or_initialize_faiss_index(query.college_name)
        
        # Call chat_with_rag with the correct parameters
        response = chat_with_rag(query.query, index_data, query.lang)
        logger.info("Query processed successfully")
        return {"answer": response}
    except ValueError as ve:
        logger.error(f"Value error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)