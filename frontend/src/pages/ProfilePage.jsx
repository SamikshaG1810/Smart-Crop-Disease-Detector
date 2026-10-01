import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  ShieldCheck, 
  Award, 
  Leaf, 
  Check, 
  AlertCircle, 
  Menu, 
  Camera, 
  Key, 
  Calendar,
  Layers,
  Sparkles,
  Edit3
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/auth';
import { getDashboardStats } from '../api/scans';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Dr. Elena Vance',
    email: user?.email || 'farmer@agroscan.com',
    farm_name: user?.farm_name || 'Verdant Valley Orchards',
    farm_location: user?.farm_location || 'Salinas Valley, CA',
    phone: '+1 (555) 382-9104',
    title: 'Senior Agronomist & Pathology Specialist',
    license: 'AGRI-CERT-88492-CA',
    acreage: '450 Acres',
    soil_type: 'Rich Sandy Loam',
    bio: 'Dedicated to precision sustainable agriculture, integrated pest management (IPM), and minimizing chemical pesticide reliance through early AI foliar diagnostics.',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Could not fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const updatedUser = await updateUserProfile({
        full_name: formData.full_name,
        farm_name: formData.farm_name,
        farm_location: formData.farm_location,
      });

      // Update in context
      updateUser(updatedUser);
      setSuccessMsg('Agronomist profile and farm metadata successfully updated!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMsg(err.response?.data?.detail || 'Failed to update profile. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
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
                Agronomist Profile & Credentials
              </h1>
              <p className="text-xs text-slate-textMuted">
                Professional accreditation, agricultural enterprise specifications & credentials
              </p>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* Notifications */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-soft-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-soft-sm">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Profile Hero Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-soft-md overflow-hidden">
            {/* Top Forest Banner */}
            <div className="h-36 sm:h-44 bg-gradient-to-r from-[#14251B] via-[#1B3B2B] to-[#2D5A3C] relative px-6 sm:px-10 flex items-end">
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-emerald-200 font-mono flex items-center gap-1.5 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Verified Commercial Agronomist
              </div>
            </div>

            {/* Profile Bar */}
            <div className="px-6 sm:px-10 pb-8 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-6">
                <div className="flex items-end space-x-4">
                  <div className="relative group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-brand-forest border-4 border-white shadow-soft-lg flex items-center justify-center text-white text-4xl font-extrabold select-none">
                      {formData.full_name?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#14251B] text-white shadow-soft-md hover:bg-brand-forest transition-colors"
                      title="Change Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-textDark">
                        {formData.full_name}
                      </h2>
                      <span className="p-1 rounded-full bg-emerald-100 text-emerald-800" title="Identity Verified">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-textMuted font-medium">
                      {formData.title}
                    </p>
                    <p className="text-xs text-brand-forest font-semibold mt-0.5 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {formData.farm_name} • {formData.farm_location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-textMuted bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full font-mono">
                    ID: {formData.license}
                  </span>
                </div>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-slate-textMuted tracking-wider block">
                    Diagnostic Scans
                  </span>
                  <span className="text-xl font-extrabold text-slate-textDark">
                    {stats?.total_scans || 6}
                  </span>
                </div>

                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-slate-textMuted tracking-wider block">
                    Canopy Vitality
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600">
                    {stats?.health_rate_percent || 94.8}%
                  </span>
                </div>

                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-slate-textMuted tracking-wider block">
                    Supported Crops
                  </span>
                  <span className="text-xl font-extrabold text-slate-textDark">
                    6 Cultivars
                  </span>
                </div>

                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-slate-textMuted tracking-wider block">
                    Model Categories
                  </span>
                  <span className="text-xl font-extrabold text-brand-forest">
                    38 classes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form & Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Farm Specs & Credentials */}
            <div className="lg:col-span-5 space-y-6">
              {/* Enterprise Specifications */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-textDark flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-forest" />
                  Agricultural Enterprise
                </h3>

                <div className="space-y-3 text-xs text-slate-textDark">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-textMuted">Farm Name:</span>
                    <span className="font-bold">{formData.farm_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-textMuted">Operational Acreage:</span>
                    <span className="font-bold">{formData.acreage}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-textMuted">Soil Profile:</span>
                    <span className="font-bold">{formData.soil_type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-textMuted">Region / Zone:</span>
                    <span className="font-bold">{formData.farm_location}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-textMuted block mb-2">
                    Crops Monitored
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Tomato', 'Potato', 'Corn (Maize)', 'Apple', 'Grape', 'Bell Pepper'].map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-full bg-brand-sageLight/60 text-brand-dark text-[11px] font-semibold border border-brand-sage/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Credentials & Security */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-textDark flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-forest" />
                  Security & Authentication
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-bold text-slate-textDark">JWT Token Authentication</p>
                      <p className="text-slate-textMuted text-[11px]">256-bit signed cryptographic sessions</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-bold text-slate-textDark">Password Protection</p>
                      <p className="text-slate-textMuted text-[11px]">Salted Bcrypt password hashing</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Password change dialog: Contact administrator or update in settings.")}
                      className="text-xs font-semibold text-brand-forest hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editable Profile Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-textDark">
                      Edit Agronomist Profile
                    </h3>
                    <p className="text-xs text-slate-textMuted">
                      Update your identity, credentials, and farm contact details
                    </p>
                  </div>
                  <Edit3 className="w-5 h-5 text-brand-sage" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="full_name"
                          required
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Account Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          disabled
                          value={formData.email}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Farm / Facility Name
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="farm_name"
                          value={formData.farm_name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                        Farm Location / Region
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          name="farm_location"
                          value={formData.farm_location}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-textMuted mb-1.5">
                      Professional Bio & Agronomic Focus
                    </label>
                    <textarea
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-full bg-[#14251B] hover:bg-[#1B3B2B] text-white text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all flex items-center gap-2 disabled:opacity-60"
                    >
                      {loading ? "Updating Profile..." : "Save Profile Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
