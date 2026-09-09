import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanLine, 
  History, 
  BookOpen, 
  Settings, 
  LogOut, 
  Sprout, 
  ChevronRight,
  Sparkles,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload New Scan', path: '/scan', icon: ScanLine, highlight: true },
    { label: 'Scan History', path: '/history', icon: History },
    { label: 'Crop Library', path: '/crops', icon: BookOpen },
    { label: 'Agronomist Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-brand-dark text-white select-none">
      {/* Top Brand Header */}
      <div>
        <div className="h-20 flex items-center px-6 border-b border-white/10 space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-sage border border-white/10 shadow-inner">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Agro<span className="text-brand-sage">Scan</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-brand-sageLight font-mono">v1.0</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">Precision Pathology</p>
          </div>
        </div>

        {/* Quick Scan CTA Pill */}
        <div className="p-4">
          <button
            onClick={() => {
              if (setMobileOpen) setMobileOpen(false);
              navigate('/scan');
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold text-sm shadow-soft-md hover:brightness-110 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
              Scan Leaf Now
            </span>
            <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 text-brand-sage group-hover:text-white transition-colors" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-white/10">
        <div 
          onClick={() => {
            if (setMobileOpen) setMobileOpen(false);
            navigate('/profile');
          }}
          className="bg-white/5 rounded-2xl p-3 mb-2 flex items-center justify-between border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-brand-forest text-brand-sageLight flex items-center justify-center font-bold text-sm border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                {user?.full_name || 'Field Agronomist'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.farm_name || 'Green Acres Farm'}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            title="Log out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="px-2 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
          Engine: MobileNetV2 Active
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 shadow-soft-xl">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
