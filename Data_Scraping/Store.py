import os
from pymongo import MongoClient
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to create chunks with overlap
def create_chunks(text, chunk_size=200, overlap=50):
    chunks = []
    words = text.split()
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = ' '.join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def process_file(file_path, collection):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    
    chunks = create_chunks(text)
    for chunk in chunks:
        embedding = model.encode(chunk).tolist()
        document = {
            "text": chunk,
            "embedding": embedding,
            "file_path": file_path
        }
        collection.insert_one(document)

def process_folders(root_path):
    for folder_name in os.listdir(root_path):
        folder_path = os.path.join(root_path, folder_name)
        if os.path.isdir(folder_path):
            collection = db[folder_name]
            
            for subfolder in os.listdir(folder_path):
                subfolder_path = os.path.join(folder_path, subfolder)
                if os.path.isdir(subfolder_path):
                    
                    if os.path.exists(subfolder_path):
                        for filename in os.listdir(subfolder_path):
                            if filename.endswith('.txt'):
                                print(filename)
                                file_path = os.path.join(subfolder_path, filename)
                                process_file(file_path, collection)
            print(f"Processed folder {folder_name}")

root_path = "root_folder"  
process_folders(root_path)
print("All data and embeddings have been successfully processed and stored in separate MongoDB collections.")