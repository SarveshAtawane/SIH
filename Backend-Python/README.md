## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   MONGO_URI=<your-mongodb-uri>
   DB_NAME=<your-database-name>
   GOOGLE_API_KEY=<your-google-api-key>
   ```

## Running the Application

To run the FastAPI application:

```bash
python main.py
```

The server will start running on `http://0.0.0.0:8000`.

## API Usage

### Ask a Query

**Endpoint:** `/ask_query`

**Method:** POST

**Request Body:**
```json
{
  "query": "Your question here",
  "college_name": "gpcajmer",
  "lang": "Hindi"
}
```

- `query`: The question you want to ask
- `college_name`: The name of the college (corresponds to the MongoDB collection name)
- `lang`: The language in which you want the response

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/ask_query" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "What facilities does the college provide?",
       "college_name": "gpcajmer",
       "lang": "Hindi"
     }'
```

**Response:**
```json
{
  "answer": "The response from the AI model in the provided language"
}
```

## Architecture

This application uses:
- FastAPI for the web framework
- MongoDB for storing document embeddings
- SentenceTransformers for generating embeddings
- Google's Generative AI (Gemini) for natural language processing
- LangChain for orchestrating the RAG pipeline

