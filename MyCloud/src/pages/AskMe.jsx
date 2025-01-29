import React, { useState } from "react";
import "../styles/askme.css";
import { uploadFile, askQuestion } from "../services/AskMeFileService"; // Import the service functions

const AskMe = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything.", sender: "bot" },
  ]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);

    setIsUploading(true);
    const result = await uploadFile(selectedFile); 
    setIsUploading(false);

    setUploadStatus(result.message);
    if (result.success) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } else {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 5000);
    }
  };
  const handleSend = async () => {
    if (question.trim() === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: question, sender: "user" },
    ]);
    const result = await askQuestion(question); 
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: result.response, sender: "bot" },
    ]);
    setQuestion(""); 
  };

  return (
    <div className="askme-container">
      <div className="chat-header">
        {fileName ? `${fileName}` : "Chat with PDF 📚"}
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <div className="upload-wrapper">
        <button
          onClick={() => document.getElementById("pdf-upload").click()}
          className="upload-button"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload PDF"}
        
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        /></button>
        </div>
        
        

        <input
          type="text"
          placeholder="Enter your question..."
          value={question}
          className="question-box"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="send-button" onClick={handleSend}>➤</button>
      </div>

      {showSuccessPopup && (
        <div className="success-popup">
          <strong>Success!</strong> {uploadStatus}
        </div>
      )}
      {showErrorPopup && (
        <div className="error-popup">
          <strong>Failed!</strong> {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default AskMe;