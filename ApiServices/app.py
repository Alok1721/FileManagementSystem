from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from transformers import pipeline
import torch
import pytesseract
from PIL import Image
import io
import easyocr

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
reader = easyocr.Reader(['en'])
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

@app.route('/extract_text', methods=['POST'])
def extract_text_from_pdf():
    file = request.files['file']
    text = extract_text_from_pdf(file)
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

def extract_text_from_pdf(file):
    try:
        with pdfplumber.open(file) as pdf:
            text = ""
            for page in pdf.pages:
                print(f"Processing page {page.page_number}...")
                if(page.page_number >5):
                    continue
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                if page.images:
                    for img in page.images:
                        try:
                            img_obj = img['stream']
                            img_data = img_obj.get_data()
                            pil_image = Image.open(io.BytesIO(img_data))
                            results = reader.readtext(pil_image)
                            for result in results:
                                text += result[1] + "\n"  
                        except Exception as img_error:
                            print(f"Error processing image on page {page.page_number}: {img_error}")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
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

def generate_embedding(text):
    try:
        if not text.strip():
            print("Error: Input text is empty!")
            return []  
        print("Input text for embedding:", text[:500])  
        embedding = embedder(text[:500])
        print("Generated embedding:", embedding)  
        embedding_tensor = torch.tensor(embedding[0]).cpu() 
        return torch.mean(embedding_tensor, dim=0).tolist()  
    except Exception as e:
        print("Error during embedding generation:", e)
        return []  

if __name__ == '__main__':
    app.run(debug=True, port=8089)
