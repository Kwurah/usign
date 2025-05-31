"use client"
import React, { useState } from 'react';
import UploadPdf from './Uploadpdf';
import Uploadsignature from './Uploadsignature';
import DownloadCard from './Download';
import StepIndicator from './StepIndicator';

const PDFSigningFlow = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'sign' | 'download'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signedFilename, setSignedFilename] = useState<string>('');

  return (
   <div className="min-h-screen  bg-white p-6">
    <h1 className='logo-black'>uSign</h1>
      <StepIndicator currentStep={currentStep} />
      {currentStep === 'upload' && (
        <UploadPdf
          setCurrentStep={setCurrentStep}
          setUploadedFile={setUploadedFile}
        />
      )}
      {currentStep === 'sign' && uploadedFile && (
        <Uploadsignature
          uploadedFile={uploadedFile}
          setCurrentStep={setCurrentStep}
          setSignedFilename={setSignedFilename}
        />
      )}
      {currentStep === 'download' && signedFilename && (
        <DownloadCard
          signedFilename={signedFilename}
          setCurrentStep={setCurrentStep}
          setUploadedFile={setUploadedFile}
          setSignedFilename={setSignedFilename}
        />
      )}
    </div>
  );
};

export default PDFSigningFlow;