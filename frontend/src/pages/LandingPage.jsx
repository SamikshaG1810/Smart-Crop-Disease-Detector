import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  Scan, 
  ShieldCheck, 
  Cpu, 
  Leaf, 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';

export const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-textDark flex flex-col selection:bg-brand-sage selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-sageLight/40 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-8 shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>MobileNetV2 Transfer Learning • 98.4% Diagnostic Accuracy</span>
          </div>

          {/* Big Centered Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#111111] tracking-tight leading-[1.08] mb-6">
            AI-Powered Crop Health, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14251B] via-emerald-800 to-teal-700">
              Instantly.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Detect foliar pathologies in seconds. Upload leaf imagery from tomatoes, potatoes, corn, and vineyards to receive clinical diagnoses, etiology, and organic treatment plans.
          </p>

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={isAuthenticated ? "/scan" : "/signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#14251B] hover:bg-[#1B3B2B] text-white text-base font-bold shadow-soft-md hover:shadow-soft-xl hover:scale-[1.02] transition-all group"
            >
              <Scan className="w-5 h-5 mr-2.5 text-brand-sage group-hover:scale-110 transition-transform" />
              Scan a Leaf Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-white hover:bg-gray-50 text-slate-textDark text-base font-semibold border border-gray-200 shadow-soft-sm hover:shadow-soft-md transition-all"
            >
              Explore Live Demo
            </button>
          </div>

          {/* Large Device Frame Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-gray-200 to-gray-300 shadow-2xl border border-gray-200/80">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-inner">
              {/* Fake browser top bar */}
              <div className="h-10 bg-gray-100 border-b border-gray-200 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white px-6 py-1 rounded-full text-[11px] font-mono text-gray-500 border border-gray-200 shadow-inner">
                  https://agroscan.io/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Mockup Dashboard Preview Content */}
              <div className="p-6 sm:p-8 bg-[#FAFAFA] text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-textDark">Verdant Valley Orchards</h3>
                    <p className="text-xs text-slate-textMuted">Live Agricultural Telemetry & Pathology Grid</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Deep CNN Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-textMuted">Total Scans</span>
                    <p className="text-2xl font-bold text-slate-textDark mt-1">1,482</p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">+14% this month</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-textMuted">Healthy Rate</span>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">94.8%</p>
                    <p className="text-[11px] text-slate-textMuted mt-0.5">High canopy vigor</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-textMuted">Pathologies</span>
                    <p className="text-2xl font-bold text-amber-600 mt-1">78</p>
                    <p className="text-[11px] text-amber-700 font-medium mt-0.5">Late Blight detected</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-soft-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-textMuted">Model Latency</span>
                    <p className="text-2xl font-bold text-slate-textDark mt-1">82ms</p>
                    <p className="text-[11px] text-slate-textMuted mt-0.5">Edge optimized</p>
                  </div>
                </div>

                {/* Sample leaf card in mockup */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=150&q=80"
                      alt="Sample leaf"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-textDark">Tomato Late Blight Detected</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                          Critical Alert
                        </span>
                      </div>
                      <p className="text-xs text-slate-textMuted mt-1">
                        Confidence: 97.4% • Recommended Organic Protocol: Copper Hydroxide & Bacillus Subtilis
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    Action Plan Generated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest">
              Clinical Precision Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-textDark mt-2">
              Three Simple Steps to Safeguard Your Crop Yield
            </h2>
            <p className="text-slate-textMuted text-sm sm:text-base mt-3">
              Built for farmers in the field and commercial agricultural enterprises requiring instant diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 hover:shadow-soft-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#14251B] text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-soft-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-textDark mb-3">
                Snap or Upload Foliage
              </h3>
              <p className="text-sm text-slate-textMuted leading-relaxed">
                Take a direct smartphone snapshot or upload leaf imagery via our camera tool. Works even in variable natural sunlight conditions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 hover:shadow-soft-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-soft-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-textDark mb-3">
                Neural Vision Inference
              </h3>
              <p className="text-sm text-slate-textMuted leading-relaxed">
                MobileNetV2 processes the 224x224 leaf tensor against 19+ PlantVillage disease profiles, calculating chlorosis, lesions, and confidence metrics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 hover:shadow-soft-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7C8B6B] text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-soft-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-textDark mb-3">
                Actionable Treatment Plans
              </h3>
              <p className="text-sm text-slate-textMuted leading-relaxed">
                Receive instant organic biological remedies and conventional chemical treatments with dosages, safety periods, and preventative cultural tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest">
              Enterprise Grade Agronomy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-textDark mt-2">
              Engineered for Scalable Farm Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-textDark mb-2">Multi-Crop Support</h4>
              <p className="text-xs sm:text-sm text-slate-textMuted leading-relaxed">
                Extensive coverage including Tomatoes, Potatoes, Corn, Apples, Bell Peppers, and Vineyards with dedicated pathology reference sheets.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-textDark mb-2">Dual Protocol Curation</h4>
              <p className="text-xs sm:text-sm text-slate-textMuted leading-relaxed">
                Clear distinction between OMRI-certified biological remedies for organic growers and registered chemical fungicides for commercial operations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-textDark mb-2">Farm Field Analytics</h4>
              <p className="text-xs sm:text-sm text-slate-textMuted leading-relaxed">
                Track historical disease occurrences across farm quadrants to detect early outbreak clusters and time preventative spraying schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#14251B] text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-sage border border-white/10">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white">AgroScan</span>
              <p className="text-xs text-gray-400">Intelligent Crop Health & Disease Diagnostic Platform</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AgroScan. PlantVillage Dataset Integration • FastAPI & MobileNetV2.
          </p>

          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <Link to="/crops-library" className="hover:text-white transition-colors">Crop Library</Link>
            <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              FastAPI Swagger UI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
