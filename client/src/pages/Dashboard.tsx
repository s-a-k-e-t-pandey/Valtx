import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface File {
  id: number;
  filename: string;
  path: string;
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/files/1', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if(!response.data){
          const res = response.data
          setFiles(res);
        }
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', '1'); // Replace with actual user ID

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFiles([...files, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Vault</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Files</h2>
          <input
            type="file"
            onChange={handleFileUpload}
            className="mb-4"
          />
          <ul>
            {files.map((file) => (
              <li
                key={file.id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleFileSelect(file)}
              >
                {file.filename}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">File Viewer</h2>
          {selectedFile ? (
            <div>
              <h3 className="text-lg font-medium mb-2">{selectedFile.filename}</h3>
              {selectedFile.filename.endsWith('.pdf') ? (
                <embed
                  src={`http://localhost:3001/${selectedFile.path}`}
                  
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              ) : selectedFile.filename.match(/\.(jpe?g|png|gif)$/i) ? (
                <img
                  src={`http://localhost:3001/${selectedFile.path}`}
                  alt={selectedFile.filename}
                  className="max-w-full h-auto"
                />
              ) : selectedFile.filename.match(/\.(mp4|webm|ogg)$/i) ? (
                <video controls width="100%">
                  <source src={`http://localhost:3001/${selectedFile.path}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>File type not supported for preview.</p>
              )}
            </div>
          ) : (
            <p>Select a file to view</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;