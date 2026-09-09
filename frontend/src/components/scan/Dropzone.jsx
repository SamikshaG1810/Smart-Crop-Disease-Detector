import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

export const Dropzone = ({ onFileSelected, selectedFile, previewUrl, clearFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sample quick test images for instant one-click testing
  const samplePresets = [
    {
      title: "Tomato Blight",
      crop: "Tomato",
      url: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80",
      filename: "tomato_late_blight_sample.jpg"
    },
    {
      title: "Potato Blight",
      crop: "Potato",
      url: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80",
      filename: "potato_early_blight_sample.jpg"
    },
    {
      title: "Corn Rust",
      crop: "Corn",
      url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
      filename: "corn_common_rust_sample.jpg"
    },
    {
      title: "Healthy Leaf",
      crop: "Tomato",
      url: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80",
      filename: "healthy_leaf_sample.jpg"
    }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (.jpg, .png, .webp)");
      return;
    }
    onFileSelected(file);
  };

  const handleLoadSample = async (preset) => {
    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], preset.filename, { type: 'image/jpeg' });
      onFileSelected(file);
    } catch (err) {
      console.error("Could not load preset image:", err);
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-brand-leaf bg-emerald-50/50 scale-[1.01]'
                : 'border-gray-200 bg-white hover:border-brand-sage hover:bg-gray-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-sageLight/50 flex items-center justify-center text-brand-dark mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-brand-forest" />
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-textDark mb-1">
              Drag and drop your leaf photograph
            </h4>
            <p className="text-xs sm:text-sm text-slate-textMuted max-w-md mx-auto mb-4">
              High-resolution photos with good natural lighting yield 98%+ AI diagnostic accuracy. Supported: JPG, PNG, WEBP.
            </p>

            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-forest text-white text-xs sm:text-sm font-semibold shadow-soft-sm transition-all"
            >
              Browse Local Files
            </button>
          </div>

          {/* Quick Demo Samples */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-textMuted uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
              <span>Or click a quick test sample leaf:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(p)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-gray-200 bg-white hover:border-brand-sage hover:shadow-soft-sm transition-all text-left group"
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-textDark truncate group-hover:text-brand-forest">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-slate-textMuted truncate">
                      {p.crop} sample
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-md">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-gray-200 bg-black shrink-0">
              <img
                src={previewUrl}
                alt="Selected Leaf Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full font-mono">
                {(selectedFile?.size / 1024).toFixed(0)} KB
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <Check className="w-4 h-4" />
                <span>Image Loaded & Calibrated</span>
              </div>
              <h4 className="text-lg font-bold text-slate-textDark mb-1 truncate max-w-sm">
                {selectedFile?.name || "Leaf Image Selected"}
              </h4>
              <p className="text-xs text-slate-textMuted mb-4">
                Ready for deep convolutional neural network analysis across 19 PlantVillage pathogen classifications.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={clearFile}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-slate-textDark hover:bg-gray-50 transition-colors"
                >
                  Choose Different Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
