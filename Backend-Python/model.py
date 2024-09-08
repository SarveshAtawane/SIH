import os
import numpy as np
import faiss
from tqdm import tqdm
from pymongo import MongoClient
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

model = SentenceTransformer('all-MiniLM-L6-v2')

os.environ["GOOGLE_API_KEY"] = "AIzaSyDzpYpw5loxzW4vEMytVw1gXPE-fldWYDw"
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

def load_embeddings_from_mongodb(college):
    collection = db[college]
    cursor = collection.find()
    documents = []
    embeddings = []
    for record in tqdm(cursor, desc=f"Loading embeddings for {college}"):
        documents.append(record["text"])
        embeddings.append(record["embedding"])
    return documents, np.array(embeddings, dtype=np.float32)  # Ensure float32 type

def build_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Use Inner Product for cosine similarity
    faiss.normalize_L2(embeddings)  # Normalize embeddings for cosine similarity
    index.add(embeddings)
    return index

college_indexes = {}

def initialize_faiss_indexes():
    global college_indexes
    for college in db.list_collection_names():
        documents, embeddings = load_embeddings_from_mongodb(college)
        if embeddings.size == 0:
            print(f"Warning: No embeddings found for college {college}")
            continue
        faiss_index = build_faiss_index(embeddings)
        college_indexes[college] = {
            "documents": documents,
            "faiss_index": faiss_index
        }
    print(f"Initialized FAISS indexes for {len(college_indexes)} colleges")

def find_similar_documents(query_embedding, college, top_k=10):
    if college not in college_indexes:
        raise ValueError(f"College '{college}' not found in the database.")
    
    index_data = college_indexes[college]
    faiss_index = index_data["faiss_index"]
    documents = index_data["documents"]
    
    query_embedding = query_embedding.astype(np.float32)  # Ensure float32 type
    faiss.normalize_L2(query_embedding.reshape(1, -1))  # Normalize query embedding
    scores, indices = faiss_index.search(query_embedding.reshape(1, -1), top_k)
    return [(documents[i], float(scores[0][j])) for j, i in enumerate(indices[0])]
def chat_with_rag(user_input, index_data, lang, top_k=10):
    query_embedding = model.encode(user_input)
    faiss_index = index_data["faiss_index"]
    documents = index_data["documents"]
    
    query_embedding = query_embedding.astype(np.float32)  # Ensure float32 type
    faiss.normalize_L2(query_embedding.reshape(1, -1))  # Normalize query embedding
    scores, indices = faiss_index.search(query_embedding.reshape(1, -1), top_k)
    similar_documents = [(documents[i], float(scores[0][j])) for j, i in enumerate(indices[0])]
    
    context = " ".join([doc[0] for doc in similar_documents])

    system_prompt = f"""You are an AI-powered Student Assistance Chatbot for the Department of Technical Education, Government of Rajasthan. Your role is to provide accurate and helpful information about engineering and polytechnic institutes in Rajasthan. You should assist with queries related to:
    
    1. Admission processes
    2. Eligibility criteria
    3. Information about different colleges
    4. Fee structures
    5. Curriculum details
    6. Scholarships
    7. Hostel facilities
    8. Previous year's college and branch-specific allotments
    9. Placement opportunities
    10. Any other relevant information for students and stakeholders
    11. Please answer in this language {lang}
    12. The context is not visible to the user so if it contains tables you please write that as well.
    Use the provided context to answer questions accurately. If you're unsure or don't have the information, politely say so and offer to help with other related queries. Always maintain a professional and helpful tone.
    If you don't have the info just tell to contact the college.
    """
    
    input_message = f"{system_prompt}\n\nContext: {context}\nQuestion: {user_input}"
    response = llm.invoke(input_message)
    return response.content