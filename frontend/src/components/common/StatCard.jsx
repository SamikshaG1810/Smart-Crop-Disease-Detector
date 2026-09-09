import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendLabel }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-textMuted uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-sageLight/50 flex items-center justify-center text-brand-dark">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-bold text-slate-textDark tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-textMuted flex items-center">
          {trendLabel && <span className="font-medium mr-1 text-slate-700">{trendLabel}</span>}
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
