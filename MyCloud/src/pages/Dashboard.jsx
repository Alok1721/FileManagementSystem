import React from "react"; 
import "../styles/dashboard.css"; 
import Slidebar from "../components/Slidebar";  // Correct import path
import StorageStats from "../components/StorageStats"; 
import RecentFilesTable from "../components/RecentFileTable"; 
import { useNavigate } from "react-router-dom";


const Dashboard = () => { 
  const navigate = useNavigate();
  return ( 
    <div className="dashboard-container"> 
      <Slidebar /> 
      <div className="main-content"> 
        <h1 className="title">MY CLOUD</h1> 
        <p className="subtitle">Hello Alok, welcome back!</p>

        <div className="features"> 
          <div className="feature-card drag-drop" onClick={() => navigate("/cloud-lift")}>CloudLift (500 uploads)</div> 
          <div className="feature-card ai-seeker" onClick={() => navigate("/ai-seeker")}>Ai-Seeker (Search files)</div> 
          <div className="feature-card ask-me" onClick={() => navigate("/ask-me")}>Ask-me (Chat with Files)</div> 
        </div>

        <StorageStats /> 
        <RecentFilesTable /> 
      </div> 
    </div> 
  ); 
};

export default Dashboard;
