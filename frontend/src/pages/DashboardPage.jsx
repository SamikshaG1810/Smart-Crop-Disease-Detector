import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scan, 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  TrendingUp, 
  Menu, 
  Plus, 
  ArrowUpRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import ScanTrendsChart from '../components/dashboard/ScanTrendsChart';
import DiseaseDistributionChart from '../components/dashboard/DiseaseDistributionChart';
import RecentScansTable from '../components/dashboard/RecentScansTable';
import Modal from '../components/common/Modal';
import ScanResultCard from '../components/scan/ScanResultCard';
import { getDashboardStats, getScanHistory } from '../api/scans';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData] = await Promise.all([
        getDashboardStats(),
        getScanHistory({ page: 1, page_size: 5 })
      ]);
      setStats(statsData);
      setRecentScans(historyData.items || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Dark Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
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
                Farm Pathology Dashboard
              </h1>
              <p className="text-xs text-slate-textMuted">
                {user?.farm_name || "Verdant Valley Orchards"} • Real-time Folia Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchData}
              title="Refresh Data"
              className="p-2.5 rounded-full border border-gray-200 text-slate-textMuted hover:text-black hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/scan"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#14251B] hover:bg-[#1B3B2B] text-white text-xs sm:text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all gap-2"
            >
              <Plus className="w-4 h-4 text-brand-sage" />
              Scan New Leaf
            </Link>
          </div>
        </header>

        {/* Dashboard Content Widgets */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#14251B] to-[#1B3B2B] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-soft-md">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Automated Disease Surveillance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Good day, {user?.full_name?.split(' ')[0] || "Agronomist"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                Your farm foliar health is currently at <span className="font-bold text-emerald-300">{stats?.health_rate_percent || 94.8}%</span> vitality. 
                {stats?.diseases_detected > 0 ? ` ${stats?.diseases_detected} active disease clusters under surveillance.` : " No severe disease epidemics detected."}
              </p>
            </div>

            <Link
              to="/scan"
              className="px-6 py-3 rounded-full bg-white text-[#14251B] text-xs sm:text-sm font-bold shadow-soft-md hover:bg-emerald-50 transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Upload Foliage Photo
            </Link>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Leaf Scans"
              value={stats?.total_scans || 0}
              subtitle="Logged across farm zones"
              icon={Scan}
              trend={12}
            />
            <StatCard
              title="Pathologies Detected"
              value={stats?.diseases_detected || 0}
              subtitle="Requiring intervention"
              icon={AlertTriangle}
            />
            <StatCard
              title="Healthy Foliage"
              value={stats?.healthy_scans || 0}
              subtitle={`${stats?.health_rate_percent || 100}% of total scans`}
              icon={ShieldCheck}
            />
            <StatCard
              title="Most Affected Crop"
              value={stats?.most_affected_crop || "None"}
              subtitle="Monitor for spore drift"
              icon={Leaf}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ScanTrendsChart data={stats?.weekly_trend} />
            </div>
            <div className="lg:col-span-4">
              <DiseaseDistributionChart
                data={stats?.crop_distribution?.map(c => ({ name: c.crop, value: c.scans }))}
              />
            </div>
          </div>

          {/* Recent Scans Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-textDark">
                Recent Diagnostic History
              </h3>
              <Link
                to="/history"
                className="text-xs font-semibold text-brand-forest hover:text-emerald-800 flex items-center gap-1"
              >
                View Full Log ({stats?.total_scans || 0})
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <RecentScansTable
              scans={recentScans}
              onSelectScan={(scan) => setSelectedScan(scan)}
            />
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        title="Diagnostic Report Details"
        maxWidth="max-w-4xl"
      >
        {selectedScan && (
          <ScanResultCard
            result={selectedScan}
            onResetScan={() => {
              setSelectedScan(null);
              navigate('/scan');
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
