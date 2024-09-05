from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import chat_with_rag

app = FastAPI()

class Query(BaseModel):
    query: str
    college_name: str
    lang: str

@app.post("/ask_query")
async def ask_query(query: Query):
    try:
        response = chat_with_rag(query.query, query.college_name, query.lang)
        print(query.query),print(query.college_name),print(query.lang)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
