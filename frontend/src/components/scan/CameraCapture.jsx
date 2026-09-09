import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Check } from 'lucide-react';

export const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Prefer back camera on phones

  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        setError(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please allow camera permissions in your browser, or upload an image file instead.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_leaf_${Date.now()}.jpg`, { type: 'image/jpeg' });
        // Stop camera tracks
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        onCapture(file);
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white max-w-lg mx-auto shadow-2xl relative border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-sm">Live Crop Leaf Camera</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center text-rose-200 text-xs">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-400 mb-2" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Optical Targeting Reticle */}
          <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
            <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
            <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
            <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
            <span className="text-[11px] font-mono text-emerald-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Center leaf blade within frame
            </span>
          </div>
        </div>
      )}

      {/* Camera Controls */}
      <div className="mt-4 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={toggleFacingMode}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Switch Camera (Front/Rear)"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={capturePhoto}
          disabled={!!error}
          className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
          title="Capture Photo"
        >
          <div className="w-12 h-12 rounded-full bg-white/20" />
        </button>

        <div className="w-10" /> {/* Balance spacer */}
      </div>
    </div>
  );
};

export default CameraCapture;
