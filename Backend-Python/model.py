import os
from sentence_transformers import SentenceTransformer
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document
from langchain.memory import ConversationBufferMemory

# Set up the model and environment
model = SentenceTransformer('all-MiniLM-L6-v2')
os.environ["GOOGLE_API_KEY"] = "AIzaSyDzpYpw5loxzW4vEMytVw1gXPE-fldWYDw"

def create_vector_store(text_data):
    text_chunks = text_data.split('\n\n')
    documents = [Document(page_content=chunk) for chunk in text_chunks]
    embeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    return FAISS.from_documents(documents, embeddings)

def setup_conversational_chain(vector_store):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    retriever = vector_store.as_retriever()
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory
    )

def chat_with_rag(chain, user_input):
    response = chain({"question": user_input})
    return response["answer"]