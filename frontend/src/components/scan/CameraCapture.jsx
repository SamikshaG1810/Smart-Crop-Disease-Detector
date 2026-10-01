import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Check } from 'lucide-react';

export const CameraCapture = ({ detector = 'leaf', onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Prefer back camera on phones

  useEffect(() => {
    let active = true;
    setCameraReady(false);
    const startCamera = async () => {
      try {
        setError(null);
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = mediaStream;
        const video = videoRef.current;
        if (!video) throw new Error('Camera preview is unavailable. Close and reopen the camera.');
        video.srcObject = mediaStream;
        await video.play();
        if (active && video.videoWidth > 0 && video.videoHeight > 0) setCameraReady(true);
      } catch (err) {
        console.error("Camera access error:", err);
        if (!active) return;
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          setError('Camera access is blocked. Allow camera permission for this site in your browser settings, then reopen Live Camera.');
        } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
          setError('No camera matching this mode was found. Switch camera or upload an image instead.');
        } else if (err.name === 'NotReadableError') {
          setError('The camera is busy in another app. Close other camera apps and try again.');
        } else {
          setError(err.message || 'Unable to start the camera. Check browser permissions or upload an image instead.');
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
      setError('The camera is still starting. Wait for the preview, then capture again.');
      setCameraReady(false);
      return;
    }

    setIsCapturing(true);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not prepare the captured image. Please try again.');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
      if (!blob || blob.size === 0) throw new Error('The camera returned an empty image. Please capture again.');

      const file = new File([blob], `camera_leaf_${Date.now()}.jpg`, { type: 'image/jpeg' });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      onCapture(file);
    } catch (captureError) {
      console.error('Camera capture error:', captureError);
      setError(captureError.message || 'Could not capture an image. Please try again.');
      setIsCapturing(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white max-w-lg mx-auto shadow-2xl relative border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-sm">Live {detector === 'fruit' ? 'Fruit' : 'Crop Leaf'} Camera</h4>
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
            onLoadedMetadata={(event) => {
              if (event.currentTarget.videoWidth > 0 && event.currentTarget.videoHeight > 0) setCameraReady(true);
            }}
            onCanPlay={() => setCameraReady(true)}
            className="w-full h-full object-cover"
          />

          {/* Optical Targeting Reticle */}
          <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
            <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
            <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
            <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
            <span className="text-[11px] font-mono text-emerald-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Center {detector === 'fruit' ? 'fruit' : 'leaf'} within frame
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
          disabled={!!error || !cameraReady || isCapturing}
          className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
          title={cameraReady ? 'Capture Photo' : 'Waiting for camera preview'}
        >
          <div className="w-12 h-12 rounded-full bg-white/20" />
        </button>

        <div className="w-10" /> {/* Balance spacer */}
      </div>
    </div>
  );
};

export default CameraCapture;
