// src/pages/AiSeeker.jsx
import React, { useState, useEffect } from "react";
import { fetchFiles } from "../services/fileService";
import "../styles/aiSeeker.css";

const AiSeeker = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const data = await fetchFiles();
    setFiles(data);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ai-seeker-container">
      <h2>AI Seeker - File Search</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by file name or uploader..."
        />
      </div>
      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Last Modified</th>
            <th>Uploaded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => (
              <tr key={index}>
                <td>{file.file_name}</td>
                <td>{file.file_size}</td>
                <td>{file.uploaded_date}</td>
                <td>{file.uploaded_by}</td>
                <td>
                  <a href={`https://svudmitjvxqhfmymuqlr.supabase.co/storage/v1/object/public/uploads/${file.file_url}`} target="_blank" rel="noopener noreferrer">View File</a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No files found matching your search</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AiSeeker;
