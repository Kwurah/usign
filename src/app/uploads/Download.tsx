"use client"
import React, { useState } from 'react';
import { Download,  Loader, Check, X } from 'lucide-react';


type Props = {
  signedFilename: string;
  setCurrentStep: (step: 'upload' | 'sign' | 'download') => void;
  setUploadedFile: (file: File | null) => void;
  setSignedFilename: (name: string) => void;
};

const DownloadCard: React.FC<Props> = ({
  signedFilename,
  setCurrentStep,
  setUploadedFile,
  setSignedFilename,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleDownload = async () => {
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    // if the filename starts with 'signed-', remove it for the download
    const filename = signedFilename.startsWith('signed-')
      ? signedFilename.replace('signed-', '')
      : signedFilename;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/download/${encodeURIComponent(filename)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch the file.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = signedFilename;
    a.click();
    window.URL.revokeObjectURL(url);

    setSuccess('Download Complete!');
  } catch {
    setError('Download failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const handleReset = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setSignedFilename('');
    setError('');
    setSuccess('');
  };



  return (
    <div className="max-w-md mx-auto mt-[5rem] bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <Download className="h-8 w-8 text-black mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-black mb-2">Download Signed PDF</h2>
        <p className="text-gray-600">Your document has been signed successfully</p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-medium text-black mb-1">Document Signed!</h3>
          <p className="text-sm text-gray-600">{signedFilename}</p>
        </div>

       

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

        <div className="space-y-3">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-3 px-4 cursor-pointer bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Signed PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-2 px-4 border cursor-pointer border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign Another Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;


