import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Leaf, 
  FlaskConical, 
  ShieldCheck, 
  Calendar, 
  Printer, 
  RefreshCw,
  Share2,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import { API_BASE_URL } from '../../api/client';

export const ScanResultCard = ({ result, onResetScan }) => {
  const [activeTab, setActiveTab] = useState('organic'); // 'organic', 'chemical', 'prevention'

  if (!result) return null;

  const {
    crop_name = 'Unknown',
    disease_name = 'Unknown',
    confidence = 0,
    engine,
    detector = 'leaf',
    severity = 'Moderate',
    image_url,
    disease_info,
    top_probabilities = []
  } = result;

  // Resolve absolute image URL if relative
  const displayImageUrl = image_url?.startsWith('http')
    ? image_url
    : `${API_BASE_URL}${image_url}`;

  const isHealthy = disease_name.toLowerCase() === 'healthy';
  const engineLabel = engine === 'fruit_svm'
    ? 'Fruit SVM classifier'
    : engine === 'keras_cnn'
      ? 'MobileNetV2 model'
      : engine === 'tflite'
        ? 'TFLite model'
        : engine
          ? 'Unknown classifier'
          : 'Engine status unavailable';
  const getCandidateLabel = (classId) => {
    if (detector === 'fruit') {
      const label = classId.split('___')[1] || classId;
      return `${crop_name} - ${label.replace(/_/g, ' ')}`;
    }
    return classId.replace('___', ' - ').replace(/_/g, ' ');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft-xl overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#14251B] to-[#1B3B2B] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-brand-sage border border-white/10 shrink-0">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {detector === 'fruit' ? `${crop_name} Fruit Disease` : `${crop_name} Diagnosis`}
              </span>
              {detector === 'leaf' && <SeverityBadge severity={severity} size="sm" />}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {disease_name}
            </h2>
            {disease_info?.scientific_name && (
              <p className="text-xs italic text-gray-300 font-serif mt-0.5">
                Pathogen: {disease_info.scientific_name}
              </p>
            )}
            <p className="mt-2 text-[11px] text-emerald-200">
              Inference engine: {engineLabel}
            </p>
          </div>
        </div>

        {/* Confidence Meter Badge */}
        <div className="flex items-center space-x-4 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-300">
              {detector === 'fruit' ? 'Relative SVM Score' : 'Model Score'}
            </p>
            <p className="text-2xl font-black text-white font-mono">
              {confidence.toFixed(1)}%
            </p>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${confidence}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute" />
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Top Split: Image + Overview & Top Probabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Leaf Thumbnail */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-soft-sm bg-slate-900 group aspect-square">
              <img
                src={displayImageUrl}
                alt={disease_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] flex justify-between items-center">
                <span>Field Sample Image</span>
                <span className="font-mono text-emerald-300">
                  {detector === 'fruit' ? '128x128 K-means features' : '224x224 RGB input'}
                </span>
              </div>
            </div>

            {/* Neural Probability Distribution */}
            {top_probabilities.length > 1 && (
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[11px] font-bold text-slate-textMuted uppercase tracking-wider mb-2">
                  {detector === 'fruit' ? 'Top Fruit Disease Classes' : 'Top Pathology Candidates'}
                </p>
                <div className="space-y-2">
                  {top_probabilities.map((prob, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between font-medium text-slate-textDark mb-0.5">
                        <span className="truncate max-w-[170px]">{getCandidateLabel(prob.class_id)}</span>
                        <span className="font-mono font-bold text-slate-700">{prob.confidence}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${idx === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}
                          style={{ width: `${Math.min(prob.confidence, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pathology Description, Cause & Symptoms */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            {detector === 'fruit' ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
                Fruit category: Citrus. This classifier does not identify fruit species. Its relative SVM score is not a calibrated probability; it was supplied with 150 feature samples across five disease labels and has no verified treatment guidance. Non-citrus fruits are unsupported. Confirm results with a qualified agricultural specialist before acting.
              </div>
            ) : <>
            <div>
              <h3 className="text-sm font-bold text-slate-textMuted uppercase tracking-wider mb-2">
                Pathology Overview
              </h3>
              <p className="text-slate-textDark text-sm sm:text-base leading-relaxed">
                {disease_info?.description || "No description available for this disease."}
              </p>
            </div>

            {/* Etiology / Cause */}
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-700" />
                Underlying Etiology & Causes
              </h4>
              <p className="text-xs sm:text-sm text-emerald-950 leading-normal">
                {disease_info?.causes || "Fungal or environmental factors."}
              </p>
            </div>

            {/* Clinical Symptoms List */}
            {disease_info?.symptoms && disease_info.symptoms.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-textMuted uppercase tracking-wider mb-2">
                  Diagnostic Visual Symptoms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {disease_info.symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 text-xs text-slate-textDark bg-gray-50 p-2.5 rounded-xl border border-gray-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>}
          </div>
        </div>

        {/* Treatment Protocol Tabs (Organic vs Chemical vs Prevention) */}
        {detector !== 'fruit' && <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-textDark flex items-center gap-2">
              <span>Treatment Protocols & Recommendations</span>
            </h3>

            {/* Tab Pill Buttons */}
            <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('organic')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'organic'
                    ? 'bg-brand-dark text-white shadow-soft-sm'
                    : 'text-slate-textMuted hover:text-slate-textDark'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Organic / Biological</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chemical')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'chemical'
                    ? 'bg-brand-dark text-white shadow-soft-sm'
                    : 'text-slate-textMuted hover:text-slate-textDark'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
                <span>Chemical / Conventional</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prevention')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'prevention'
                    ? 'bg-brand-dark text-white shadow-soft-sm'
                    : 'text-slate-textMuted hover:text-slate-textDark'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Preventative IPM</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panes */}
          <div className="rounded-2xl p-6 border transition-all">
            {activeTab === 'organic' && (
              <div className="bg-emerald-50/30 border-emerald-200/60 p-6 rounded-2xl">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm mb-3">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>OMRI-Compliant & Biological Control Protocol</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {disease_info?.organic_treatment || "Follow standard organic bio-fungicide guidelines."}
                </p>
              </div>
            )}

            {activeTab === 'chemical' && (
              <div className="bg-amber-50/30 border-amber-200/60 p-6 rounded-2xl">
                <div className="flex items-center space-x-2 text-amber-950 font-bold text-sm mb-3">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  <span>Conventional Fungicide / Bactericide Regimen</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {disease_info?.chemical_treatment || "Apply registered agricultural fungicides following label precautions."}
                </p>
                <p className="mt-4 text-[11px] text-amber-800 italic bg-amber-100/60 p-3 rounded-xl border border-amber-200">
                  Always consult local agricultural extension services, wear PPE, and observe pre-harvest intervals (PHI) before application.
                </p>
              </div>
            )}

            {activeTab === 'prevention' && (
              <div className="bg-blue-50/30 border-blue-200/60 p-6 rounded-2xl">
                <div className="flex items-center space-x-2 text-blue-950 font-bold text-sm mb-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Agronomic Cultural Practices & Long-Term Prevention</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {disease_info?.prevention || "Implement crop rotation and hygienic canopy pruning."}
                </p>
              </div>
            )}
          </div>
        </div>}

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-slate-textDark hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-2 text-gray-500" />
              Print Diagnostic Report
            </button>
          </div>

          <button
            type="button"
            onClick={onResetScan}
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-brand-dark hover:bg-brand-forest text-white text-xs sm:text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all group"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            {detector === 'fruit' ? 'Scan Another Fruit' : 'Scan Another Crop Leaf'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultCard;
