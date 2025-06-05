
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader, Check, X, Edit3, Upload, Pen, Image } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

type SignatureProps = {
  uploadedFile: File | null;
  setCurrentStep: (step: "upload" | "sign" | "download") => void;
  setSignedFilename: (filename: string) => void;
};

const UploadSignatureWithPreview: React.FC<SignatureProps> = ({
  uploadedFile,
  setCurrentStep,
  setSignedFilename,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [signatureData, setSignatureData] = useState({
    signature: "",
    x: 150,
    y: 150,
    width: 200,
    height: 50,
    page: 1,
  });

  const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [typedSignature, setTypedSignature] = useState("");
    const [signatureMethod, setSignatureMethod] = useState<"draw" | "upload" | "type">("draw");
  const [uploadedSignature, setUploadedSignature] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Convert PDF to images using backend
  useEffect(() => {
    if (!uploadedFile) return;

    const convertPdfToImages = async () => {
      setLoadingPdf(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await fetch("http://127.0.0.1:8000/convert-pdf-to-images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to convert PDF");

        const data = await response.json();
        setPdfPages(data.images); 
      } catch (err) {
        setError("Failed to load PDF preview");
        console.error(err);
      } finally {
        setLoadingPdf(false);
      }
    };

    convertPdfToImages();
  }, [uploadedFile]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSignatureData({
      ...signatureData,
      x,
      y,
      page: currentPage,
    });
  };
const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;
      setUploadedSignature(dataURL);
      const base64 = dataURL.split(",")[1];
      setSignatureData({ ...signatureData, signature: base64 });
      setError("");
    };
    reader.readAsDataURL(file);
  };

const handleSignatureSubmit = async () => {
    let signatureToSubmit = "";
    
    // Get signature based on method
    switch (signatureMethod) {
      case "draw":
        if (!sigPad) {
          setError("Signature pad not initialized");
          return;
        }
        signatureToSubmit = signatureData.signature;
        break;
      case "upload":
        signatureToSubmit = signatureData.signature;
        break;
      case "type":
        if (!typedSignature.trim()) {
          setError("Please enter your signature text");
          return;
        }
        
        // Create a canvas with the typed signature
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'black';
          ctx.font = '32px cursive';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
          signatureToSubmit = canvas.toDataURL().split(",")[1];
        }
        break;
    }

    if (!signatureToSubmit) {
      setError("Please create your signature first");
      return;
    }
    
    if (!uploadedFile) {
      setError("No file uploaded");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...signatureData,
        page: signatureData.page - 1,
        signature: signatureToSubmit,
        filename: uploadedFile.name,
      };

      console.log("Sending payload:", payload);

   

      const response = await fetch("http://127.0.0.1:8000/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      setSignedFilename(data?.signedFilename || `signed-${uploadedFile.name}`);
      setSuccess("Document signed successfully!");
      setTimeout(() => {
        setSuccess("");
        setCurrentStep("download");
      }, 1500);
    } catch (error) {
    //   console.error("Signing error:", error);
    //   setError(`Failed to sign document: ${error.message}`);
    // } finally {
    //   setLoading(false);
    if (error instanceof Error) {
    setError(`Failed to sign document: ${error.message}`);
  } else {
    setError("Failed to sign document: An unknown error occurred.");
  }
    }
    console.log('Submitting signature on page:', signatureData.page, 'Total pages:', pdfPages.length);
  };

  const saveDrawnSignature = () => {
    if (sigPad) {
      const dataURL = sigPad.toDataURL();
      const base64 = dataURL.split(",")[1];
      setSignatureData({ ...signatureData, signature: base64 });
    }
  };

  const clearDrawnSignature = () => {
    if (sigPad) {
      sigPad.clear();
      setSignatureData({ ...signatureData, signature: "" });
    }
  };
  const hasSignature = () => {
    switch (signatureMethod) {
      case "draw": return !!signatureData.signature;
      case "upload": return !!uploadedSignature;
      case "type": return !!typedSignature.trim();
      default: return false;
    }
  };
  if (!uploadedFile) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-center text-gray-500">No file uploaded</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <Edit3 className="h-8 w-8 text-black mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-black">Sign Document</h2>
          <p className="text-gray-600 mt-2">File: {uploadedFile.name}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: PDF Preview as Images */}
        <div>
          <div className="border border-gray-300 rounded">
            {loadingPdf ? (
              <div className="flex items-center justify-center h-96">
                <Loader className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading PDF preview...</span>
              </div>
            ) : pdfPages.length > 0 ? (
              <div
                ref={previewRef}
                onClick={handleImageClick}
                className="relative cursor-crosshair"
              >
                <img
                  src={`data:image/png;base64,${pdfPages[currentPage - 1]}`}
                  alt={`Page ${currentPage}`}
                  className="w-full h-auto"
                />
                
                {/* Signature placeholder */}
                {signatureData.page === currentPage && signatureData.signature && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-50 flex items-center justify-center text-xs font-medium text-blue-700"
                    style={{
                      top: signatureData.y,
                      left: signatureData.x,
                      width: signatureData.width,
                      height: signatureData.height,
                      pointerEvents: "none",
                    }}
                  >
                    Signature Here
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                Failed to load PDF preview
              </div>
            )}
          </div>

          {/* Page Navigation */}
          {pdfPages.length > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {pdfPages.length}
              </span>
              <button
                disabled={currentPage >= pdfPages.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right: Signature Input */}
        <div>
          <div className="space-y-4">

          </div>
          <div className="space-y-6">
          {/* Signature Method Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Choose Signature Method</h3>

            <div className="grid grid-cols-3 gap-3">
              {/* draww */}
              <button
                onClick={() => setSignatureMethod("draw")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signatureMethod === "draw"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Pen className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Draw</div>
                <div className="text-xs text-gray-500">Use mouse/touch</div>
              </button>
              
              <button
                onClick={() => setSignatureMethod("upload")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signatureMethod === "upload"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image className="w-6 h-6 mx-auto mb-2"  />
                <div className="text-sm font-medium">Upload</div>
                <div className="text-xs text-gray-500">Image file</div>
              </button>
              
              <button
                onClick={() => setSignatureMethod("type")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  signatureMethod === "type"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Edit3 className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Type</div>
                <div className="text-xs text-gray-500">Text signature</div>
              </button>
            </div>
          </div>

          {/* Signature Creation Area */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {signatureMethod === "draw" && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Draw Your Signature</h4>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{
                      width: 400,
                      height: 120,
                      className: "w-full rounded",
                    }}
                    ref={(ref) => setSigPad(ref)}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={clearDrawnSignature}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={saveDrawnSignature}
                    className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Save Signature
                  </button>
                </div>
              </div>
            )}

            {signatureMethod === "upload" && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Upload Signature Image</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadedSignature ? (
                    <div className="space-y-3">
                      <img
                        src={uploadedSignature}
                        alt="Uploaded signature"
                        className="max-h-20 mx-auto border rounded"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload signature image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {signatureMethod === "type" && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Type Your Signature</h4>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                {typedSignature && (
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div
                      className="text-2xl text-center py-2"
                      style={{ fontFamily: 'cursive' }}
                    >
                      {typedSignature}
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>

          {/* Size Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Signature Size</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Width</label>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={signatureData.width}
                  onChange={(e) => setSignatureData({
                    ...signatureData,
                    width: parseInt(e.target.value)
                  })}
                  className="w-full accent-blue-500"
                />
                <div className="text-center text-sm text-gray-500 mt-1">{signatureData.width}px</div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Height</label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={signatureData.height}
                  onChange={(e) => setSignatureData({
                    ...signatureData,
                    height: parseInt(e.target.value)
                  })}
                  className="w-full accent-blue-500"
                />
                <div className="text-center text-sm text-gray-500 mt-1">{signatureData.height}px</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setCurrentStep("upload")}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              ← Back to Upload
            </button>
            <button
              onClick={handleSignatureSubmit}
              disabled={loading || !hasSignature()}
              className="flex-1 py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin inline mr-2" />
                  Signing Document...
                </>
              ) : (
                <>
                  ✍️ Sign Document
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
              <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start">
              <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSignatureWithPreview;

