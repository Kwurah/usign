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
  const [signatureMethod, setSignatureMethod] = useState<
    "draw" | "upload" | "type"
  >("draw");
  const [uploadedSignature, setUploadedSignature] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for managing saved signatures
  const [tempTypedSignature, setTempTypedSignature] = useState("");
  const [tempUploadedSignature, setTempUploadedSignature] =
    useState<string>("");
  const [savedSignatures, setSavedSignatures] = useState({
    draw: false,
    upload: false,
    type: false,
  });

  // Store actual PDF dimensions for proper scaling
  const [pdfDimensions, setPdfDimensions] = useState({
    width: 595,
    height: 842,
  }); // Default A4 dimensions

  // Convert PDF to images using backend
  useEffect(() => {
    if (!uploadedFile) return;

    const convertPdfToImages = async () => {
      setLoadingPdf(true);
      try {
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/convert-pdf-to-images`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Failed to convert PDF");

        const data = await response.json();
        setPdfPages(data.images);
        if (data.dimensions) {
          setPdfDimensions(data.dimensions);
        }
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

    const img = previewRef.current.querySelector("img");
    if (!img) return;

    // Get the image's bounding rectangle
    const imgRect = img.getBoundingClientRect();

    // Calculate click position relative to the image
    const x = e.clientX - imgRect.left;
    const y = e.clientY - imgRect.top;

    // Ensure click is within image bounds
    if (x < 0 || y < 0 || x > imgRect.width || y > imgRect.height) {
      return;
    }

    // Scale coordinates to match the actual PDF dimensions
    // This converts from display coordinates to PDF coordinates
    const scaleX = pdfDimensions.width / imgRect.width;
    const scaleY = pdfDimensions.height / imgRect.height;

    const pdfX = x * scaleX;
    const pdfY = y * scaleY;

    // Center the signature on the click point
    const centeredX = Math.max(0, pdfX - signatureData.width / 2);
    const centeredY = Math.max(0, pdfY - signatureData.height / 2);

    // Ensure signature doesn't go beyond page boundaries
    const finalX = Math.min(
      centeredX,
      pdfDimensions.width - signatureData.width
    );
    const finalY = Math.min(
      centeredY,
      pdfDimensions.height - signatureData.height
    );

    setSignatureData({
      ...signatureData,
      x: finalX,
      y: finalY,
      page: currentPage,
    });
  };

  const handleSignatureFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;
      setTempUploadedSignature(dataURL);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const saveUploadedSignature = () => {
    setUploadedSignature(tempUploadedSignature);
    const base64 = tempUploadedSignature.split(",")[1];
    setSignatureData({ ...signatureData, signature: base64 });
    setSavedSignatures({ ...savedSignatures, upload: true });
  };

  const cancelUploadedSignature = () => {
    setTempUploadedSignature("");
    setError("");
  };

  const saveTypedSignature = () => {
    setTypedSignature(tempTypedSignature);

    // Create a canvas with the typed signature
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.font = "32px cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tempTypedSignature, canvas.width / 2, canvas.height / 2);
      const base64 = canvas.toDataURL().split(",")[1];
      setSignatureData({ ...signatureData, signature: base64 });
    }
    setSavedSignatures({ ...savedSignatures, type: true });
  };

  const cancelTypedSignature = () => {
    setTempTypedSignature("");
  };

  const handleSignatureSubmit = async () => {
    let signatureToSubmit = "";

    // Get signature based on method
    switch (signatureMethod) {
      case "draw":
        if (!sigPad || !savedSignatures.draw) {
          setError("Please draw and save your signature first");
          return;
        }
        signatureToSubmit = signatureData.signature;
        break;
      case "upload":
        if (!savedSignatures.upload) {
          setError("Please upload and save your signature first");
          return;
        }
        signatureToSubmit = signatureData.signature;
        break;
      case "type":
        if (!savedSignatures.type) {
          setError("Please type and save your signature first");
          return;
        }
        signatureToSubmit = signatureData.signature;
        break;
    }

    if (!signatureToSubmit) {
      setError("Please create and save your signature first");
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign`, {
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
      if (error instanceof Error) {
        setError(`Failed to sign document: ${error.message}`);
      } else {
        setError("Failed to sign document: An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveDrawnSignature = () => {
    if (sigPad) {
      const dataURL = sigPad.toDataURL();
      const base64 = dataURL.split(",")[1];
      setSignatureData({ ...signatureData, signature: base64 });
      setSavedSignatures({ ...savedSignatures, draw: true });
    }
  };

  const clearDrawnSignature = () => {
    if (sigPad) {
      sigPad.clear();
      setSignatureData({ ...signatureData, signature: "" });
      setSavedSignatures({ ...savedSignatures, draw: false });
    }
  };

  const hasSignature = () => {
    switch (signatureMethod) {
      case "draw":
        return savedSignatures.draw;
      case "upload":
        return savedSignatures.upload;
      case "type":
        return savedSignatures.type;
      default:
        return false;
    }
  };

  // Function to calculate signature position for display
  const getSignatureDisplayStyle = () => {
    if (!previewRef.current) return {};

    const img = previewRef.current.querySelector("img");
    if (!img) return {};

    const imgRect = img.getBoundingClientRect();

    // Convert PDF coordinates back to display coordinates
    const displayX = (signatureData.x / pdfDimensions.width) * imgRect.width;
    const displayY = (signatureData.y / pdfDimensions.height) * imgRect.height;
    const displayWidth =
      (signatureData.width / pdfDimensions.width) * imgRect.width;
    const displayHeight =
      (signatureData.height / pdfDimensions.height) * imgRect.height;

    return {
      left: `${displayX}px`,
      top: `${displayY}px`,
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
    };
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
                  className="w-full h-auto block"
                />

                {/* Signature placeholder - show only if signature is saved */}
                {signatureData.page === currentPage && hasSignature() && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-50 flex items-center justify-center text-xs font-medium text-blue-700 pointer-events-none"
                    style={getSignatureDisplayStyle()}
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {pdfPages.length}
              </span>
              <button
                disabled={currentPage >= pdfPages.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right: Signature Input */}
        <div>
          <div className="space-y-6">
            {/* Signature Method Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Choose Signature Method
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {/* Draw */}
                <button
                  onClick={() => setSignatureMethod("draw")}
                  className={`lg:p-4 p-2 rounded-lg border-2 transition-all ${
                    signatureMethod === "draw"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Pen className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Draw</div>
                  <div className="text-xs text-gray-500">Use mouse/touch</div>
                  {savedSignatures.draw && (
                    <div className="text-xs text-green-600 mt-1">✓ Saved</div>
                  )}
                </button>

                <button
                  onClick={() => setSignatureMethod("upload")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    signatureMethod === "upload"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Upload</div>
                  <div className="text-xs text-gray-500">Image file</div>
                  {savedSignatures.upload && (
                    <div className="text-xs text-green-600 mt-1">✓ Saved</div>
                  )}
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
                  {savedSignatures.type && (
                    <div className="text-xs text-green-600 mt-1">✓ Saved</div>
                  )}
                </button>
              </div>
            </div>

            {/* Signature Creation Area */}
            <div className="bg-gray-50 p-6 rounded-lg">
              {signatureMethod === "draw" && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">
                    Draw Your Signature
                  </h4>
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
                      className="text-sm text-red-600 hover:text-red-800 underline cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={saveDrawnSignature}
                      className="text-sm text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                    >
                      Save Signature
                    </button>
                  </div>
                  {savedSignatures.draw && (
                    <div className="text-center text-sm text-green-600 font-medium">
                      ✓ Signature saved! Click on the document to position it.
                    </div>
                  )}
                </div>
              )}

              {signatureMethod === "upload" && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">
                    Upload Signature Image
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {tempUploadedSignature ? (
                      <div className="space-y-3">
                        <img
                          src={tempUploadedSignature}
                          alt="Uploaded signature"
                          className="max-h-20 mx-auto border rounded"
                        />
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={cancelUploadedSignature}
                            className="text-sm text-red-600 hover:text-red-800 underline"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveUploadedSignature}
                            className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                          >
                            Save Signature
                          </button>
                        </div>
                      </div>
                    ) : uploadedSignature ? (
                      <div className="space-y-3">
                        <img
                          src={uploadedSignature}
                          alt="Saved signature"
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
                        <p className="text-sm text-gray-600">
                          Click to upload signature image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
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
                  {savedSignatures.upload && (
                    <div className="text-center text-sm text-green-600 font-medium">
                      ✓ Signature saved! Click on the document to position it.
                    </div>
                  )}
                </div>
              )}

              {/* typed signature */}
              {signatureMethod === "type" && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">
                    Type Your Signature
                  </h4>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={tempTypedSignature}
                    onChange={(e) => setTempTypedSignature(e.target.value)}
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />

                  {tempTypedSignature && (
                    <div className="flex justify-between gap-3 ">
                      <button
                        onClick={cancelTypedSignature}
                        className="text-sm text-red-600 hover:text-red-800 underline cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveTypedSignature}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                      >
                        Save Signature
                      </button>
                    </div>
                  )}

                  {savedSignatures.type && (
                    <div className="space-y-3">
                      <div className="bg-white border rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Saved signature:
                        </p>
                        <div
                          className="text-2xl text-center py-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          {typedSignature}
                        </div>
                      </div>
                      <div className="text-center text-sm text-green-600 font-medium">
                        ✓ Signature saved! Click on the document to position it.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Size Controls - Only show if signature is saved */}
            {hasSignature() && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Signature Size</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Width
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={signatureData.width}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value);
                        setSignatureData({
                          ...signatureData,
                          width: newWidth,
                          // Adjust position if signature would go beyond page boundaries
                          x: Math.min(
                            signatureData.x,
                            pdfDimensions.width - newWidth
                          ),
                        });
                      }}
                      className="w-full accent-blue-500"
                    />
                    <div className="text-center text-sm text-gray-500 mt-1">
                      {signatureData.width}px
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Height
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      value={signatureData.height}
                      onChange={(e) => {
                        const newHeight = parseInt(e.target.value);
                        setSignatureData({
                          ...signatureData,
                          height: newHeight,
                          // Adjust position if signature would go beyond page boundaries
                          y: Math.min(
                            signatureData.y,
                            pdfDimensions.height - newHeight
                          ),
                        });
                      }}
                      className="w-full accent-blue-500"
                    />
                    <div className="text-center text-sm text-gray-500 mt-1">
                      {signatureData.height}px
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <>✍️ Sign Document</>
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
