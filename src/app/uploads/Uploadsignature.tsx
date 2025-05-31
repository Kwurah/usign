
"use client";
import React, { useState } from "react";
import { FileText, Loader, Check, X, Edit3 } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";



type SignatureProps = {
  uploadedFile: File | null;
  setCurrentStep: (step: "upload" | "sign" | "download") => void;
  setSignedFilename: (filename: string) => void;
};

const UploadSignature: React.FC<SignatureProps> = ({
  uploadedFile,
  setCurrentStep,
  setSignedFilename,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [signatureData, setSignatureData] = useState({
    signature: "",
    x: 100,
    y: 100,
    width: 200, 
    height: 50,
    page: 1,
  });
const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null);
  const handleSignatureSubmit = async () => {
    if (!signatureData.signature.trim()) {
      setError("Please provide your signature");
      return;
    }

    if (!uploadedFile) {
      setError("No file found to sign.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...signatureData,
        filename: uploadedFile.name,
      };

      const response = await fetch("http://127.0.0.1:8000/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Signing failed: ${response.statusText}`);
      }

      const data = await response.json();
      const signedFileName = data?.signedFilename || `signed-${uploadedFile.name}`;

      setSignedFilename(signedFileName);
      setSuccess("Document signed successfully!");
      setTimeout(() => {
        setSuccess("");
        setCurrentStep("download");
      }, 1500);
    } catch  {
      setError( "Signing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-[3rem] bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <Edit3 className="h-8 w-8 text-black mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-black mb-2">Sign Document</h2>
        <p className="text-gray-600">Review and add your signature</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">
            {uploadedFile?.name || "No file uploaded"}
          </h3>
          <p className="text-sm text-gray-600">PDF Preview (integrate with react-pdf)</p>
        </div>

        <div className="space-y-4">
          
<label className="block text-sm font-medium text-black mb-2">
  Draw Your Signature
</label>
<SignatureCanvas
  penColor="black"
  canvasProps={{ width: 500, height: 150, className: "border rounded-md" }}
  ref={(ref) => setSigPad(ref)}
/>
<button
  onClick={() => {
    if (sigPad) {
      const dataURL = sigPad.toDataURL(); 
      const base64 = dataURL.split(",")[1]; 
      setSignatureData({ ...signatureData, signature: base64 });
    }
  }}
  className="mt-2 text-sm underline text-blue-500"
>
  Save Signature
</button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">X Position</label>
              <input
                type="number"
                value={signatureData.x}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, x: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Y Position</label>
              <input
                type="number"
                value={signatureData.y}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, y: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Width</label>
              <input
                type="number"
                value={signatureData.width}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, width: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Page</label>
              <input
                type="number"
                value={signatureData.page}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, page: parseInt(e.target.value) })
                }
                min={1}
                className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
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

        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep("upload")}
            className="flex-1 py-2 px-4 border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSignatureSubmit}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Signing...</span>
              </>
            ) : (
              <span>Sign Document</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSignature;