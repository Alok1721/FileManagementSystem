import React, { useState } from "react";
import "../styles/askme.css";

const AskMe = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything.", sender: "bot" }
  ]);

  const handleSend = () => {
    if (question.trim() === "") return;
    setMessages([...messages, { text: question, sender: "user" }]);
    setTimeout(() => {
      let response = getBotResponse(question);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, sender: "bot" }
      ]);
    }, 1000);

    setQuestion(""); 
  };
  
  const getBotResponse = (input) => {
    if (input.toLowerCase().includes("artificial intelligence")) {
      return "Artificial Intelligence is the simulation of human intelligence in machines.";
    }
    return "I don't have an answer for that, but feel free to ask more!";
  };

  return (
    <div className="askme-container">
      <div className="chat-header">Artificial Intelligence.pdf</div>
      
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default AskMe;
