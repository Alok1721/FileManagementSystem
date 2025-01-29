from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import logging
import io
import pdfplumber
from transformers import pipeline
from PIL import Image
import numpy as np
import easyocr
from docx import Document
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer


# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173","https://marvelous-macaron-3ae036.netlify.app"],#http://localhost:5173https://marvelous-macaron-3ae036.netlify.app
                             "methods": ["GET", "POST", "OPTIONS"],
                             "allow_headers": ["Content-Type", "Authorization"],
                             "supports_credentials": True
                             }})

# Initialize easyocr and transformers pipeline
reader = easyocr.Reader(['en'])
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Gemini configuration
GOOGLE_API_KEY = "AIzaSyDaLV2r9UaT7bMvEVX9lztTgGCtaSfcJtc"  # Replace with your API key
genai.configure(api_key=GOOGLE_API_KEY)


class ChatWithMe:
    def __init__(self, app: Flask):
        self.app = app
        CORS(app)
        self._setup_routes()

    def _setup_routes(self):
        """Define the routes for the Flask app."""
        @self.app.route('/chatAi/')
        def index():
            return render_template('index.html')

        @self.app.route('/chatAi/upload', methods=['POST'])
        def upload_pdf():
            try:
                if 'file' not in request.files:
                    return jsonify({"error": "No file uploaded"}), 400
                file = request.files['file']
                if file.filename == '':
                    return jsonify({"error": "No file selected"}), 400
                
                text = self.extract_text_from_file(file)
                chunks = self.get_text_chunks(text)
                self.app.config['chunks'] = chunks
                
                return jsonify({"message": "PDF uploaded and processed successfully"}), 200
            except Exception as e:
                logging.error(f"Error in upload: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route('/chatAi/ask', methods=['POST'])
        def ask_question():
            try:
                data = request.json
                question = data.get('question')
                if not question:
                    return jsonify({"error": "No question provided"}), 400
                
                chunks = self.app.config.get('chunks', [])
                context = " ".join(chunks)
                
                # Get response from Gemini
                response = self.get_gemini_response(question, context)
                
                return jsonify({"response": response}), 200
            except Exception as e:
                logging.error(f"Error in /ask route: {e}")
                return jsonify({"error": str(e)}), 500

    def extract_text_from_file(self, file):
        """Extract text from the uploaded file."""
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension == 'pdf':
            return self.extract_text_from_pdf_file(file)
        elif file_extension in ['docx']:
            return self.extract_text_from_docx(file)
        elif file_extension in ['txt']:
            return self.extract_text_from_txt(file)
        elif file_extension in ['jpg', 'jpeg', 'png']:
            return self.extract_text_from_image(file)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

    def extract_text_from_pdf_file(self, file):
        """Extract text from a PDF file."""
        try:
            with pdfplumber.open(file) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            logging.error(f"Error extracting text from PDF: {e}")
            return ""

    def extract_text_from_docx(self, file):
        """Extract text from a DOCX file."""
        try:
            doc = Document(io.BytesIO(file.read()))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logging.error(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_text_from_txt(self, file):
        """Extract text from a TXT file."""
        try:
            return file.read().decode('utf-8')
        except Exception as e:
            logging.error(f"Error extracting text from TXT: {e}")
            return ""

    def extract_text_from_image(self, file):
        """Extract text from an image."""
        try:
            image = Image.open(file)
            results = reader.readtext(np.array(image))
            text = " ".join([result[1] for result in results])
            return text
        except Exception as e:
            logging.error(f"Error extracting text from image: {e}")
            return ""

    def get_text_chunks(self, text):
        """Split text into chunks for processing."""
        try:
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=10000,
                chunk_overlap=1000
            )
            chunks = text_splitter.split_text(text)
            return chunks
        except Exception as e:
            logging.error(f"Error splitting text into chunks: {e}")
            return []

    def get_gemini_response(self, question, context):
        """Get response from Gemini API based on the provided context."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""You are a helpful AI assistant that answers questions based on the given context.
            Context: {context}
            
            Question: {question}
            
            Please provide a clear and concise answer based on the context provided. If the answer is not in the context, say "I cannot find information about this in the document."
            
            Answer:"""
            
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logging.error(f"Error interacting with Gemini API: {e}")
            return "I cannot find information about this in the document."

    def summarize_text(self, text):
        """Summarize long text."""
        try:
            summarized = summarizer(text, max_length=200, min_length=50, do_sample=False)
            return summarized[0]['summary_text']
        except Exception as e:
            logging.error(f"Error during summarization: {e}")
            return text


# Initialize ChatWithMe class
chat_with_me = ChatWithMe(app)

@app.route('/extract_text', methods=['POST'])
def extract_text():
    """Route to extract text, summarize, and generate embedding."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    text = chat_with_me.extract_text_from_file(file)
    summary = chat_with_me.summarize_text(text)
    embedding = generate_embedding(summary)
    return jsonify({
        'extracted_text': text,
        'summary': summary,
        'embedding': embedding
    })

def generate_embedding(text):
    try:
        if not text.strip():
            return []  # Return empty list if text is empty
        embedding = embedder.encode(text)
        embedding = embedding / np.linalg.norm(embedding)
        return embedding.tolist()
    except Exception as e:
        logging.error(f"Error during embedding generation: {e}")
        return []


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8089)
