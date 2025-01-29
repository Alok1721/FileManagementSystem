# File Management System

![File Management System](https://github.com/user-attachments/assets/32bf7ae5-e5cf-4682-b486-c16542b69c7d) 

## Overview

Effortlessly find any file with our File Management System. This application utilizes hybrid search (keyword & semantic) and AI-powered similarity matching for rapid and accurate file retrieval. The "Talk with PDF" feature enables AI-driven Q&A and summarization, unlocking the knowledge within your documents. With centralized storage, secure authentication, and intuitive organization tools, managing your files has never been easier.

## Problem Addressed

- **Inefficient Search**: Difficulty in finding specific files.
- **Time-Consuming Information Retrieval**: Extracting relevant information from documents.
- **Scalable and Flexible**: Handles large datasets across platforms.
- **Limited Insights**: Difficulty in gaining a comprehensive understanding of the information contained within a collection of files.
- **Poor Organization**: Challenges in organizing and maintaining a structured file system, leading to confusion and lost files.

## Future Aspects

- **Enhanced AI Capabilities**: Multi-lingual support, automated tagging, and categorization.
- **Chat with All File Types**: Expanded functionality for various file types.
- **Advanced Analytics**: Improved insights and data analysis.
- **Automatic File Organization**: Automatically segregate files into folders.

## Innovations

- **Hybrid Search (Keyword + Semantic)**: Utilize Supabase's pgvector extension to store text embeddings generated from uploaded files.
- **Backend Embedding Generation and Text Extraction**: Integrate with embedding models for enhanced data processing.
- **"Talk with Any File" Feature**: Integrate with language models to interact with various file types, including images.
- **File Organization and Folder Management**: Implement a hierarchical file structure with folder creation and organization.
- **Fast Search with Contextual Recall**: Optimize search queries with fuzzy search and context-aware search.
![ChatWithAnyFile](https://github.com/user-attachments/assets/c2653bb1-0e6c-4ed1-a415-b747075c49dd) 
## Technologies Used

- **Languages**: Python (Backend), JavaScript (Frontend), SQL
- **Frameworks**: Flask/Django (Backend), React.js (UI)
- **Libraries**: Langchain, Flask, pdfplumber, Pillow, OpenCV, Hugging Face, Transformers
- **Database**: Supabase (PostgreSQL)
- **Version Control**: Git, GitHub
- **Deployment/DevOps**: CI/CD pipeline, Docker
- **Testing & Analytics**: Prometheus, Google Analytics

## Demo

- **Live Demo**: [File Management System Demo](https://marvelous-macaron-3ae036.netlify.app)
- **GitHub Repository**: [File Management System GitHub](https://github.com/Alok1721/FileManagementSystem/tree/deployed)

## How to Run and Test Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Alok1721/FileManagementSystem.git
2. **Navigate to the API Service:**:
   ```bash
   cd FileManagementSystem/ApiService
3. **Install Requirements:**:
    ```bash
   pip install -r requirements.txt
4. **Run the Backend:**:
    ```bash
   python app.py
5. **Navigate to the Frontend:**:
   ```bash
   cd MyCloud
6. **Start the Frontend:**:
   ```bash
   vite
