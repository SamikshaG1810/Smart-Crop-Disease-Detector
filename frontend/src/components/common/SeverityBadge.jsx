import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

export const SeverityBadge = ({ severity, size = "md" }) => {
  const sev = (severity || 'Moderate').toLowerCase();

  let styles = {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
    label: severity || 'Moderate'
  };

  if (sev === 'healthy') {
    styles = {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
      label: 'Healthy'
    };
  } else if (sev === 'low') {
    styles = {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-blue-600" />,
      label: 'Low Severity'
    };
  } else if (sev === 'moderate') {
    styles = {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />,
      label: 'Moderate Severity'
    };
  } else if (sev === 'high') {
    styles = {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <AlertOctagon className="w-3.5 h-3.5 mr-1 text-orange-600" />,
      label: 'High Severity'
    };
  } else if (sev === 'critical' || sev === 'severe') {
    styles = {
      bg: 'bg-red-50 text-red-800 border-red-200',
      icon: <AlertOctagon className="w-3.5 h-3.5 mr-1 text-red-600" />,
      label: 'Critical Alert'
    };
  }

  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs sm:text-sm";

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles.bg} ${sizeClasses}`}>
      {styles.icon}
      {styles.label}
    </span>
  );
};

export default SeverityBadge;
