
import "../styles/cloudLift.css";
import React, { useState, useEffect } from 'react';
import { supabase } from '../createClient.js';
import { fetchFiles, uploadFile } from "../services/fileService";

const CloudLift = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const data = await fetchFiles();
    setFiles(data);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { success, error } = await uploadFile(file);

    if (success) {
      loadFiles();
    } else {
      console.error('Error during file upload:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Cloud Lift - File Upload</h2>
      <div
        style={{
          border: '2px dashed #007bff',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} id="fileInput" />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#007bff' }}>
          Click here to upload your file
        </label>
      </div>
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Last Modified</th>
            <th>Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.file_name}</td>
              <td>{file.file_size}</td>
              <td>{file.uploaded_date}</td>
              <td>{file.uploaded_by}</td>
              <td>
                <a href={`https://svudmitjvxqhfmymuqlr.supabase.co/storage/v1/object/public/uploads/${file.file_url}`} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CloudLift;
