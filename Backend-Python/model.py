import os
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

model = SentenceTransformer('all-MiniLM-L6-v2')

os.environ["GOOGLE_API_KEY"] = "AIzaSyDzpYpw5loxzW4vEMytVw1gXPE-fldWYDw"
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

def find_similar_documents(query_embedding,college, top_k=10):
    print(college)
    collection = db[college]
    cursor = collection.find()
    similarities = []

    for record in cursor:
        text = record["text"]
        embedding = np.array(record["embedding"])
        
        similarity = np.dot(query_embedding, embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(embedding))
        similarities.append((text, similarity))
    
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    return similarities[:top_k]

def chat_with_rag(user_input,college,lang):
    query_embedding = model.encode(user_input)
    similar_documents = find_similar_documents(query_embedding,college=college)
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
    11. Please answeer in this language {lang}
    Use the provided context to answer questions accurately. If you're unsure or don't have the information, politely say so and offer to help with other related queries. Always maintain a professional and helpful tone.
    If you dont have the info just tell to conatct the college.
    """
    
    input_message = f"{system_prompt}\n\nContext: {context}\nQuestion: {user_input}"
    print(input_message)
    response = llm.invoke(input_message)
    return response.content
