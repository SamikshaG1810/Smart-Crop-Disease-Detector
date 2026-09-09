import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Leaf, 
  ChevronRight, 
  ShieldAlert, 
  FlaskConical, 
  CheckCircle2, 
  Menu,
  ExternalLink,
  Sprout
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import SeverityBadge from '../components/common/SeverityBadge';
import Modal from '../components/common/Modal';
import { getSupportedCrops } from '../api/crops';
import { useAuth } from '../context/AuthContext';

export const CropLibraryPage = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const data = await getSupportedCrops();
        setCrops(data);
      } catch (err) {
        console.error("Failed to load crops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  // Collect all disease items
  const allDiseases = crops.flatMap(c => c.diseases || []);

  const filteredDiseases = allDiseases.filter(d => {
    const matchesCrop = selectedCrop === 'All' || d.crop_name.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch = !search || 
      d.disease_name.toLowerCase().includes(search.toLowerCase()) ||
      d.crop_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.scientific_name && d.scientific_name.toLowerCase().includes(search.toLowerCase()));
    return matchesCrop && matchesSearch;
  });

  const content = (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#14251B] to-[#1B3B2B] rounded-3xl p-6 sm:p-8 text-white shadow-soft-md">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Agronomy Reference Library
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Plant Pathology & Treatment Encyclopedia
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
          Verified pathology profiles, etiology, diagnostic symptoms, and curated organic & chemical treatments for high-value agricultural crops.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search crop or disease..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
          />
        </div>

        {/* Crop Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Pepper'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCrop === crop
                  ? 'bg-brand-dark text-white shadow-soft-sm'
                  : 'bg-gray-100 text-slate-textMuted hover:text-slate-textDark'
              }`}
            >
              {crop === 'Corn' ? 'Corn (Maize)' : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-textMuted">
          Loading crop pathology records...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-sm hover:shadow-soft-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {d.crop_name}
                  </span>
                  <SeverityBadge severity={d.severity} size="sm" />
                </div>

                <h3 className="text-lg font-bold text-slate-textDark group-hover:text-brand-forest transition-colors">
                  {d.disease_name}
                </h3>

                {d.scientific_name && (
                  <p className="text-xs italic text-slate-textMuted font-serif mb-3">
                    {d.scientific_name}
                  </p>
                )}

                <p className="text-xs text-slate-textDark line-clamp-3 leading-relaxed mb-4">
                  {d.description}
                </p>

                {/* Quick Symptoms teaser */}
                {d.symptoms && d.symptoms.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-[11px] text-slate-700 space-y-1 mb-4">
                    <span className="font-bold text-[10px] uppercase text-slate-textMuted tracking-wider block">
                      Key Symptom:
                    </span>
                    <p className="truncate">• {d.symptoms[0]}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-forest group-hover:translate-x-0.5 transition-transform">
                <span>View Full Protocol & Treatments</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disease Detail Modal */}
      <Modal
        isOpen={!!selectedDisease}
        onClose={() => setSelectedDisease(null)}
        title={selectedDisease ? `${selectedDisease.crop_name}: ${selectedDisease.disease_name}` : ""}
        maxWidth="max-w-3xl"
      >
        {selectedDisease && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                  {selectedDisease.crop_name}
                </span>
                <h3 className="text-2xl font-bold text-slate-textDark mt-0.5">
                  {selectedDisease.disease_name}
                </h3>
                {selectedDisease.scientific_name && (
                  <p className="text-xs italic text-slate-textMuted font-serif">
                    Pathogen: {selectedDisease.scientific_name}
                  </p>
                )}
              </div>
              <SeverityBadge severity={selectedDisease.severity} />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-textMuted tracking-wider mb-1.5">
                Pathology Overview
              </h4>
              <p className="text-sm text-slate-textDark leading-relaxed">
                {selectedDisease.description}
              </p>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
              <h4 className="text-xs font-bold uppercase text-amber-900 tracking-wider mb-1">
                Etiology & Favorable Conditions
              </h4>
              <p className="text-xs text-amber-950 leading-normal">
                {selectedDisease.causes}
              </p>
            </div>

            {selectedDisease.symptoms && selectedDisease.symptoms.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-textMuted tracking-wider mb-2">
                  Diagnostic Visual Symptoms
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-textDark">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organic Treatment */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Organic / Biological Control Protocol</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedDisease.organic_treatment}
              </p>
            </div>

            {/* Chemical Treatment */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200">
              <div className="flex items-center space-x-2 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <span>Conventional Fungicide Application</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedDisease.chemical_treatment}
              </p>
            </div>

            {/* Prevention */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200">
              <h4 className="text-xs font-bold uppercase text-blue-950 tracking-wider mb-1.5">
                Long-Term Prevention & Agronomic Practices
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedDisease.prevention}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-textMuted hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-textDark tracking-tight">
                  Crop Pathology Library
                </h1>
                <p className="text-xs text-slate-textMuted">
                  Diagnostic reference data for 19+ PlantVillage crop diseases
                </p>
              </div>
            </div>
          </header>
          {content}
        </main>
      </div>
    );
  }

  // If public visitor
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />
      <div className="flex-1">
        {content}
      </div>
    </div>
  );
};

export default CropLibraryPage;
