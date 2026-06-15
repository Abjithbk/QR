import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { uploadPhoto } from '../services/storage';

export default function CameraCapture({ eventId, userId }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadPhoto(eventId, file, userId || 'anonymous');
      // In a real app, you might show a success toast here
    } catch (error) {
      console.error("Upload failed", error);
      // In a real app, you might show an error toast here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <button
        onClick={handleCaptureClick}
        disabled={isUploading}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <Camera className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
