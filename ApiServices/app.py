from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from transformers import pipeline
import torch
import pytesseract
from PIL import Image
import io
import easyocr
import numpy as np
import nbformat
from docx import Document

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"],
                             "methods": ["GET", "POST", "OPTIONS"],
                             "allow_headers": ["Content-Type", "Authorization"],
                             "supports_credentials": True
                             }})
reader = easyocr.Reader(['en'])
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

def extract_text_from_file(file):
    file_extension = file.filename.split('.')[-1].lower()
    print(f"Processing file: {file.filename}")
    print(f"File extension: {file_extension}")
    if file_extension == 'pdf':
        return extract_text_from_pdf_file(file)
    elif file_extension in ['docx']:
        return extract_text_from_docx(file)
    elif file_extension in ['txt']:
        return extract_text_from_txt(file)
    elif file_extension in ['jpg', 'jpeg', 'png']:
        return extract_text_from_image(file)
    elif file_extension in ['ipynb']:
        return extract_text_from_ipynb(file)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")
def extract_text_from_pdf_file(file):
    isOnlyImage=False
    print("file:",file)
    try:
        with pdfplumber.open(file) as pdf:
            text = ""
            is_text_pdf = False
            for page in pdf.pages[:3]:  # Check first 3 pages to determine type
                if page.extract_text().strip():
                    is_text_pdf = True
                    break
            if is_text_pdf:
                print("\n\ncontain only text\n")

                for page in pdf.pages:
                    print(f"Processing page {page.page_number}...")
                    if(page.page_number >10):
                        break
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            else:
                print("\n\ncontain only combination of images\n")
                for page in pdf.pages:
                    if page.page_number>10:
                        break
                    if page.images:
                        for img in page.images:
                            try:
                                img_obj = img['stream']
                                img_data = img_obj.get_data()
                                pil_image = Image.open(io.BytesIO(img_data))
                                img_array = np.array(pil_image)
                                results = reader.readtext(img_array)
                                for result in results:
                                    text += result[1] + "\n"  
                            except Exception as img_error:
                                print(f"Error processing image on page {page.page_number}: {img_error}")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""  

def extract_text_from_docx( file):
        """Extract text from DOCX files"""
        try:
            doc = Document(io.BytesIO(file.read()))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error processing DOCX: {e}")
            return ""
def extract_text_from_txt(file):
    try:
        return file.read().decode('utf-8')
    except Exception as e:
        print(f"Error extracting text from TXT: {e}")
        return ""
def extract_text_from_image(file):
        try:
            image = Image.open(file)
            results = reader.readtext(np.array(image))
            text = " ".join([result[1] for result in results])
            return text
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return ""

def extract_text_from_ipynb(file):
    try:
        import nbformat
        notebook = nbformat.read(file, as_version=4)
        text = ""
        for cell in notebook.cells:
            if cell.cell_type == 'markdown' or cell.cell_type == 'code':
                text += cell.source + "\n"
        return text
    except Exception as e:
        print(f"Error extracting text from IPYNB: {e}")
        return ""
def summarize_text(text):
    try:
        chunks = text.split('\n')  
        summarized_chunks = []
        for chunk in chunks:
            if len(chunk.split()) > 100:
                summarized = summarizer(chunk, max_length=200, min_length=50, do_sample=False)
                summarized_chunks.append(summarized[0]['summary_text'])
            else:
                summarized_chunks.append(chunk)
        return ' '.join(summarized_chunks)
    except Exception as e:
        print("Error during summarization:", e)
        return text 

from sentence_transformers import SentenceTransformer

# Initialize the SentenceTransformer model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text):
    try:
        if not text.strip():
            print("Error: Input text is empty!")
            return []  
        print("Input text for embedding:", text[:500])  
        
        # Generate sentence-level embedding
        embedding = embedder.encode(text)
        
        # Normalize the embedding to a unit vector
        embedding = embedding / np.linalg.norm(embedding)
        
        print("Generated embedding:", embedding)  
        return embedding.tolist()  # Convert numpy array to list
    except Exception as e:
        print("Error during embedding generation:", e)
        return []

@app.route('/extract_text', methods=['POST'])
def extract_text_from_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    text = extract_text_from_file(file)
    summary = summarize_text(text)
    embedding = generate_embedding(summary)
    return jsonify({
        'extracted_text': text,
        'summary': summary,
        'embedding': embedding
    })

@app.route('/generate_embedding', methods=['POST'])
def generate_embedding_route():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" in request payload'}), 400
    text = data['text']
    embedding = generate_embedding(text)
    if not embedding:
        return jsonify({'error': 'Failed to generate embedding'}), 500
    return jsonify({'embedding': embedding})

# def extract_text_from_pdf(file):
#     try:
#         with pdfplumber.open(file) as pdf:
#             text = ""
#             for page in pdf.pages:
#                 print(f"Processing page {page.page_number}...")
#                 if(page.page_number >10):
#                     continue
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#                 # if page.images:
#                 #     for img in page.images:
#                 #         try:
#                 #             img_obj = img['stream']
#                 #             img_data = img_obj.get_data()
#                 #             pil_image = Image.open(io.BytesIO(img_data))
#                 #             results = reader.readtext(pil_image)
#                 #             for result in results:
#                 #                 text += result[1] + "\n"  
#                 #         except Exception as img_error:
#                 #             print(f"Error processing image on page {page.page_number}: {img_error}")
#         return text
#     except Exception as e:
#         print(f"Error extracting text from PDF: {e}")
#         return ""  


   
if __name__ == '__main__':
    app.run(debug=True, port=8089)
