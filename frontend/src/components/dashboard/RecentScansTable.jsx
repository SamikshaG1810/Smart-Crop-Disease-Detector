import React from 'react';
import { Eye, ExternalLink, Calendar, MapPin } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import { API_BASE_URL } from '../../api/client';

export const RecentScansTable = ({ scans, onSelectScan }) => {
  if (!scans || scans.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-soft-sm">
        <p className="text-sm font-semibold text-slate-textDark mb-1">No scans recorded yet</p>
        <p className="text-xs text-slate-textMuted">Upload or capture your first crop leaf photo to start generating diagnoses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-textDark">
            Recent Pathology Scans
          </h4>
          <p className="text-xs text-slate-textMuted">
            Chronological log of AI leaf classifications across your farm zones
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-slate-textMuted uppercase tracking-wider">
              <th className="py-3 px-6">Leaf Sample</th>
              <th className="py-3 px-6">Crop & Disease</th>
              <th className="py-3 px-6">Severity</th>
              <th className="py-3 px-6">Confidence</th>
              <th className="py-3 px-6">Field Zone</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-slate-textDark">
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
                <tr
                  key={scan.id}
                  className="hover:bg-gray-50/60 transition-colors group cursor-pointer"
                  onClick={() => onSelectScan && onSelectScan(scan)}
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-6">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-gray-200 shrink-0">
                      <img
                        src={displayImageUrl}
                        alt={scan.disease_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </td>

                  {/* Crop & Disease */}
                  <td className="py-3 px-6">
                    <p className="font-bold text-slate-textDark text-sm group-hover:text-emerald-700 transition-colors">
                      {scan.disease_name}
                    </p>
                    <p className="text-[11px] text-slate-textMuted">
                      {scan.crop_name}
                    </p>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-6">
                    <SeverityBadge severity={scan.severity} size="sm" />
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-6">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-slate-800">
                        {scan.confidence?.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Field Zone */}
                  <td className="py-3 px-6 text-slate-textMuted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {scan.field_location || 'Zone A'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-6 text-slate-textMuted whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {scanDate}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScan && onSelectScan(scan);
                      }}
                      className="p-2 rounded-xl text-slate-textMuted hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScansTable;
