import "../styles/cloudlift.css";
import React, { useState, useEffect } from 'react';
import { fetchFiles, uploadFile } from "../services/fileService";

const CloudLift = () => {
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

    const { success, message } = await uploadFile(file);

    if (success) {
      setSuccessMessage(message);
      loadFiles();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } else {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error('Error during file upload:', message);
    }
  };

  return (
    <div className="cloudlift-container">
      {/* Success Message Popup */}
      {successMessage && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="error-popup">
          {errorMessage}
        </div>
      )}
      <h2>Cloud Lift - File Upload</h2>
      <div className="upload-box">
        <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} id="fileInput" />
        <label htmlFor="fileInput" className="upload-label">
          Click here to upload your file
        </label>
      </div>
      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Last Modified</th>
            <th>Uploaded By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.file_name}</td>
              <td>{file.file_size}</td>
              <td>{new Date(file.uploaded_dateTime).toLocaleDateString()}</td>
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