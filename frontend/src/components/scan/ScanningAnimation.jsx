import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, Cpu } from 'lucide-react';

export const ScanningAnimation = ({ imagePreview }) => {
  const [step, setStep] = useState(0);

  const steps = [
    "Preprocessing leaf geometry & RGB channels...",
    "Extracting deep convolutional feature maps...",
    "Cross-referencing PlantVillage pathology classes...",
    "Generating severity metrics & treatment protocols..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft-lg flex flex-col items-center justify-center text-center max-w-xl mx-auto">
      {/* Scanning Viewport */}
      <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-brand-sage/40 shadow-inner mb-6 bg-slate-900">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Scanning Leaf"
            className="w-full h-full object-cover opacity-80 filter brightness-95"
          />
        )}
        {/* Laser Scanner Bar */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-scan-line" />
        
        {/* Corner Reticles */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

        <div className="absolute bottom-2 inset-x-0 text-center">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-emerald-400 font-bold">
            MobileNetV2 Inference
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-brand-dark font-bold text-lg mb-2">
        <Cpu className="w-5 h-5 text-brand-sage animate-spin text-emerald-600" />
        <span>AI Diagnostic Engine Analyzing...</span>
      </div>

      <p className="text-xs text-slate-textMuted max-w-sm mb-6">
        Evaluating chlorotic patterns, lesion concentricity, and vascular necrosis.
      </p>

      {/* Checklist of steps */}
      <div className="w-full space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-gray-100">
        {steps.map((label, idx) => {
          const isDone = idx < step;
          const isCurrent = idx === step;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs font-medium transition-all ${
                isDone
                  ? 'text-emerald-700'
                  : isCurrent
                  ? 'text-brand-dark font-semibold scale-[1.01]'
                  : 'text-gray-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-brand-sage animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
              )}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanningAnimation;
