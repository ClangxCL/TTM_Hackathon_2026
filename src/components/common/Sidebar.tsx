import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Compass,
  Pill,
  BarChart3,
  GitCompare,
  Database,
  Info,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { to: '/', label: 'หน้าแรก & วิสัยทัศน์', icon: Sparkles, badge: '' },
    { to: '/patients', label: 'เคสผู้ป่วย (10 เคส)', icon: Users, badge: '10' },
    { to: '/smutthan', label: '1. Smutthan Engine', icon: Compass, badge: 'AI' },
    { to: '/prescribe', label: '2. สั่งยาแผนไทย & ตรวจ HDI', icon: Pill, badge: 'Core' },
    { to: '/analytics', label: '3. ICD-10-TM Analytics', icon: BarChart3, badge: 'Real-time' },
    { to: '/inter-rater', label: 'ความสอดคล้องแพทย์', icon: GitCompare, badge: '' },
    { to: '/admin-hdi', label: 'ฐานข้อมูลกลาง HDI', icon: Database, badge: 'MOPH' },
    { to: '/status', label: 'สถานะระบบต้นแบบ', icon: Info, badge: 'MVP' },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col justify-between transition-all duration-300 border-r border-slate-800 shrink-0 no-print ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <HeartPulse className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-white tracking-tight text-sm block">
                  TTM Smutthan
                </span>
                <span className="text-[10px] text-brand-400 font-mono tracking-wider block">
                  ENGINE PLATFORM
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0 transition group-hover:scale-110" />
              {!collapsed && (
                <div className="flex items-center justify-between w-full truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-slate-800 text-brand-400 px-1.5 py-0.5 rounded-full font-mono border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Hackathon Tag */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-400">TTM Hackathon 2026</div>
          <div>กองวิชาการและแผนงาน กรมการแพทย์แผนไทยฯ</div>
        </div>
      )}
    </aside>
  );
};
