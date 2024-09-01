
1. Store embeddings by uploading a text file:
   ```bash
   curl -X POST "http://localhost:8000/store_embeddings" \
        -H "Content-Type: multipart/form-data" \
        -F "file=@/path/to/your/data.txt"
   ```
   Replace `/path/to/your/data.txt` with the actual path to your data file.

2. Ask a question:
   ```bash
   curl -X POST "http://localhost:8000/ask_query" \
        -H "Content-Type: application/json" \
        -d '{"question": "Your question here"}'
   ```
   Replace "Your question here" with your actual question.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/store_embeddings` | POST | Upload a text file to store embeddings |
| `/ask_query` | POST | Ask a question based on the stored embeddings |
