
import "../styles/cloudLift.css";
import React, { useState, useEffect } from 'react';
import { supabase } from '../createClient.js';

const CloudLift = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    let { data, error } = await supabase.from('uploads').select('*');
    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data);
    }
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    const { error: insertError } = await supabase.from('uploads').insert([
      {
        // id: 2,
        file_name: file.name,
        file_size: (file.size / 1024).toFixed(2) + ' KB',
        uploaded_by: `User${Math.floor(Math.random() * 1000)}`,
        uploaded_date: new Date().toISOString().split('T')[0],
        file_url: data.path,
      },
    ]);

    if (insertError) {
      console.error('Database insert error:', insertError);
      alert('Error:', insertError.message);
    } else {
      fetchFiles();
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
