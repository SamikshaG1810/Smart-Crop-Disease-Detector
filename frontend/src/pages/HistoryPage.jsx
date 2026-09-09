import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar, 
  MapPin, 
  Eye, 
  Trash2, 
  Menu,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import SeverityBadge from '../components/common/SeverityBadge';
import Modal from '../components/common/Modal';
import ScanResultCard from '../components/scan/ScanResultCard';
import { getScanHistory, deleteScan } from '../api/scans';
import { API_BASE_URL } from '../api/client';

export const HistoryPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getScanHistory({
        crop: cropFilter,
        severity: severityFilter,
        search: search,
        page: 1,
        page_size: 50,
      });
      setScans(data.items || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 250);
    return () => clearTimeout(timer);
  }, [cropFilter, severityFilter, search]);

  const handleDelete = async (e, scanId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this scan record?")) {
      try {
        await deleteScan(scanId);
        setScans(scans.filter(s => s.id !== scanId));
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
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
                Diagnostic Scan Records
              </h1>
              <p className="text-xs text-slate-textMuted">
                Historical database of past leaf inspections and treatments
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-slate-textMuted'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-soft-sm text-brand-dark' : 'text-slate-textMuted'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search disease, crop, or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-textMuted">Crop:</span>
                <select
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-textDark bg-white focus:outline-none focus:ring-2 focus:ring-brand-forest"
                >
                  <option value="All">All Crops</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Corn">Corn (Maize)</option>
                  <option value="Apple">Apple</option>
                  <option value="Grape">Grape</option>
                  <option value="Pepper">Bell Pepper</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-textMuted">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-textDark bg-white focus:outline-none focus:ring-2 focus:ring-brand-forest"
                >
                  <option value="All">All Severities</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="p-12 text-center text-slate-textMuted text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-forest" />
              <span>Loading scan history records...</span>
            </div>
          ) : scans.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft-sm">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-textDark">No Diagnostic Records Found</h3>
              <p className="text-xs text-slate-textMuted mt-1">Try resetting search filters or upload a new crop leaf photo.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scans.map((scan) => {
                const displayImageUrl = scan.image_url?.startsWith('http')
                  ? scan.image_url
                  : `${API_BASE_URL}${scan.image_url}`;

                const scanDate = scan.created_at
                  ? new Date(scan.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent';

                return (
                  <div
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={displayImageUrl}
                        alt={scan.disease_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <SeverityBadge severity={scan.severity} size="sm" />
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-mono font-bold">
                        {scan.confidence?.toFixed(1)}%
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                          {scan.crop_name}
                        </span>
                        <h4 className="text-base font-bold text-slate-textDark mt-0.5 group-hover:text-brand-forest transition-colors">
                          {scan.disease_name}
                        </h4>
                        {scan.notes && (
                          <p className="text-xs text-slate-textMuted line-clamp-2 mt-1 italic">
                            "{scan.notes}"
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-textMuted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {scan.field_location || 'Zone A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {scanDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table Mode */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-slate-textMuted uppercase tracking-wider">
                    <th className="py-3.5 px-6">Leaf Sample</th>
                    <th className="py-3.5 px-6">Crop & Disease</th>
                    <th className="py-3.5 px-6">Severity</th>
                    <th className="py-3.5 px-6">Confidence</th>
                    <th className="py-3.5 px-6">Zone</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {scans.map((scan) => {
                    const displayImageUrl = scan.image_url?.startsWith('http')
                      ? scan.image_url
                      : `${API_BASE_URL}${scan.image_url}`;

                    return (
                      <tr
                        key={scan.id}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                        onClick={() => setSelectedScan(scan)}
                      >
                        <td className="py-3 px-6">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-gray-200">
                            <img
                              src={displayImageUrl}
                              alt={scan.disease_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <p className="font-bold text-slate-textDark text-sm">{scan.disease_name}</p>
                          <p className="text-[11px] text-slate-textMuted">{scan.crop_name}</p>
                        </td>
                        <td className="py-3 px-6">
                          <SeverityBadge severity={scan.severity} size="sm" />
                        </td>
                        <td className="py-3 px-6 font-mono font-bold text-slate-800">
                          {scan.confidence?.toFixed(1)}%
                        </td>
                        <td className="py-3 px-6 text-slate-textMuted">
                          {scan.field_location || 'Zone A'}
                        </td>
                        <td className="py-3 px-6 text-slate-textMuted whitespace-nowrap">
                          {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-6 text-right space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedScan(scan);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, scan.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
            onResetScan={() => setSelectedScan(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
