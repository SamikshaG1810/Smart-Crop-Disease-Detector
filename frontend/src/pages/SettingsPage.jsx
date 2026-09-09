import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  User, 
  Building, 
  MapPin, 
  Globe, 
  Bell, 
  LogOut, 
  Check, 
  ShieldCheck, 
  Menu 
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Dr. Elena Vance',
    email: user?.email || 'farmer@agroscan.com',
    farm_name: user?.farm_name || 'Verdant Valley Orchards',
    farm_location: user?.farm_location || 'Salinas Valley, CA',
    language: 'en',
    alert_critical: true,
    alert_weekly: true,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                Farm Profile & Preferences
              </h1>
              <p className="text-xs text-slate-textMuted">
                Manage your account credentials, regional presets, and telemetry alerts
              </p>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Farm profile settings successfully saved.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Agronomist Profile */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft-sm space-y-4">
              <h3 className="text-base font-bold text-slate-textDark flex items-center gap-2">
                <User className="w-4 h-4 text-brand-forest" />
                Agronomist Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-textMuted uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-textMuted uppercase mb-1">
                    Account Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft-sm space-y-4">
              <h3 className="text-base font-bold text-slate-textDark flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-forest" />
                Agricultural Enterprise Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-textMuted uppercase mb-1">
                    Farm / Vineyard Name
                  </label>
                  <input
                    type="text"
                    name="farm_name"
                    value={formData.farm_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-textMuted uppercase mb-1">
                    Geographic Region
                  </label>
                  <input
                    type="text"
                    name="farm_location"
                    value={formData.farm_location}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  />
                </div>
              </div>
            </div>

            {/* Regional and Language Preference */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft-sm space-y-4">
              <h3 className="text-base font-bold text-slate-textDark flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-forest" />
                Regional & Language Settings
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-textMuted uppercase mb-1">
                  Primary Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest bg-white"
                >
                  <option value="en">English (US / International)</option>
                  <option value="es">Español (América Latina)</option>
                  <option value="fr">Français (Agricole)</option>
                  <option value="pt">Português (Brasil)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="sw">Kiswahili</option>
                </select>
                <p className="text-[11px] text-slate-textMuted mt-1">
                  Changes interface terminology and pathology recommendations.
                </p>
              </div>
            </div>

            {/* Notification Alerts */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft-sm space-y-4">
              <h3 className="text-base font-bold text-slate-textDark flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-forest" />
                Pathology Alert Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="alert_critical"
                    checked={formData.alert_critical}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-forest focus:ring-brand-forest"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-textDark">Critical Epidemic Spore Alerts</p>
                    <p className="text-[11px] text-slate-textMuted">Notify immediately when Late Blight or severe rot is identified.</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="alert_weekly"
                    checked={formData.alert_weekly}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-forest focus:ring-brand-forest"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-textDark">Weekly Farm Foliage Digest</p>
                    <p className="text-[11px] text-slate-textMuted">Receive statistical trends on scanned crop quadrants.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Save and Logout Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#14251B] hover:bg-[#1B3B2B] text-white text-xs sm:text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-3 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of AgroScan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
