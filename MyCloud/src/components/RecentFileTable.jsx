import "../styles/dashboard.css";
import React, { useState, useEffect } from 'react';
import { supabase } from '../createClient.js';

const RecentFilesTable = () => {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        
        const { data, error } = await supabase
          .from('uploads') 
          .select('*')
          .order('uploaded_dateTime', { ascending: false }) 
          .limit(5); 

        if (error) {
          throw error;
        }
        
        setFiles(data); 
      } catch (error) {
        console.error('Error fetching files:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recent-files">
      <h3>Recent Files</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploader</th>
            <th>Date</th>
            <th>Size</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file) => (
              <tr key={file.id}> 
                <td>{file.file_name}</td>
                <td>{file.uploaded_by}</td>
                <td>{new Date(file.uploaded_dateTime).toLocaleDateString()}</td> 
                <td>{file.file_size}</td>
                <td>{file.file_name.split('.').pop().toUpperCase()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No recent files available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentFilesTable;

