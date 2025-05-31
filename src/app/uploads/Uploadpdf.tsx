"use client";

import React, { useState } from 'react';
import { Upload, FileText, Loader, Check, X } from 'lucide-react';

interface UploadPdfProps {
  setCurrentStep: (step: 'sign') => void;
  setUploadedFile: (file: File) => void;
}

const UploadPdf: React.FC<UploadPdfProps> = ({ setCurrentStep, setUploadedFile }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // API call to upload PDF
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Optionally, you can get response data if backend returns something
      // const data = await response.json();

      setUploadedFile(file);
      setSuccess('File uploaded successfully!');
      setTimeout(() => {
        setSuccess('');
        setCurrentStep('sign');
      }, 1000);

    } catch{
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[9rem] bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <Upload className="h-8 w-8 text-black mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-black mb-2">Upload PDF</h2>
        <p className="text-gray-600">Select a PDF document to sign</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-black font-medium">Click to select PDF</p>
            <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
          </label>
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-black">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <X className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
            <Check className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPdf;