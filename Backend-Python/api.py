from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from model import create_vector_store, setup_conversational_chain, chat_with_rag

app = FastAPI()

vector_store = None
conversational_chain = None

class Query(BaseModel):
    question: str

@app.post("/store_embeddings")
async def store_embeddings(file: UploadFile = File(...)):
    global vector_store, conversational_chain
    try:
        contents = await file.read()
        text = contents.decode("utf-8")
        vector_store = create_vector_store(text)
        conversational_chain = setup_conversational_chain(vector_store)
        return {"message": "Embeddings stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask_query")
async def ask_query(query: Query):
    global conversational_chain
    if not conversational_chain:
        raise HTTPException(status_code=400, detail="Please store embeddings first")
    try:
        response = chat_with_rag(conversational_chain, query.question)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)