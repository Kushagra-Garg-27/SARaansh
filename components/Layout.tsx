import React, { useState } from 'react';
import { LayoutDashboard, FileText, Settings, ShieldAlert, LogOut, Menu, History, ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogoClick?: () => void;
}

const NavItem = ({
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  icon: unknown, 
  label: string, 
  active: boolean, 
  onClick: () => void, 
  collapsed: boolean 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group px-3 mb-1">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} py-3 text-sm font-medium transition-all duration-200 ease-editorial group relative ${
          active
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        {/* Active Indicator Bar */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-accent transition-all duration-300 ease-editorial ${active ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}></div>

        <div className={`flex items-center justify-center flex-shrink-0 w-5 h-5 transition-transform duration-300 ${active ? 'text-white scale-110' : 'text-neutral-500 group-hover:text-white'}`}>
           <Icon size={18} strokeWidth={active ? 2 : 1.5} />
        </div>
        
        <span 
          className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-editorial origin-left ml-3 ${
            collapsed ? 'w-0 opacity-0 scale-x-90' : 'w-auto opacity-100 scale-x-100'
          }`}
        >
          {label}
        </span>
      </button>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-white text-ink-900 text-xs font-medium border border-neutral-200 shadow-xl whitespace-nowrap z-50 transition-all duration-200 pointer-events-none ${showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          {label}
        </div>
      )}
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, onLogoClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-paper overflow-hidden font-sans selection:bg-accent selection:text-white">
      {/* Sidebar - Solid Ink Black with slide-in animation */}
      <aside 
        className={`${
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        } bg-ink-900 flex-shrink-0 flex flex-col h-full z-20 transition-all duration-500 ease-editorial relative shadow-2xl animate-enter-slide`}
      >
        {/* Header / Logo */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} bg-ink-900 transition-all duration-300`}>
          <div 
            onClick={onLogoClick}
            className={`flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity`}
            role="button"
            aria-label="Go to Home"
          >
            <div className="w-8 h-8 bg-white rounded-none flex-shrink-0 flex items-center justify-center">
              <ShieldAlert className="text-ink-900" size={18} fill="currentColor" />
            </div>
            <span 
              className={`text-white font-display font-bold text-xl tracking-tight whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'
              }`}
            >
              SARaansh
            </span>
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-neutral-500 hover:text-white transition-colors p-1.5 ${isCollapsed ? 'hidden' : 'block'}`}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className={`px-6 mb-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Platform
          </div>
          <NavItem
            icon={LayoutDashboard}
            label="Overview"
            active={activePage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
            collapsed={isCollapsed}
          />
          <NavItem
            icon={FileText}
            label="Active Cases"
            active={activePage === 'cases' || activePage === 'case-detail'}
            onClick={() => onNavigate('cases')}
            collapsed={isCollapsed}
          />
           <NavItem
            icon={History}
            label="Audit Trail"
            active={activePage === 'audit'}
            onClick={() => onNavigate('audit')}
            collapsed={isCollapsed}
          />
          
          <div className={`px-6 mt-10 mb-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            System
          </div>
          <NavItem
            icon={Settings}
            label="Configuration"
            active={activePage === 'settings'}
            onClick={() => onNavigate('settings')}
            collapsed={isCollapsed}
          />
        </nav>

        {/* Toggle (Collapsed Mode) */}
        {isCollapsed && (
          <div className="w-full flex justify-center py-4">
             <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-neutral-500 hover:text-white transition-colors p-1.5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="p-6 border-t border-white/10 bg-ink-900">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} transition-all duration-300`}>
            <div className="w-8 h-8 bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-medium hover:bg-neutral-700 transition-colors">
                SJ
            </div>
            
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100'}`}>
              <div className="text-sm font-medium text-white whitespace-nowrap">Sarah Jenkins</div>
              <div className="text-xs text-neutral-500 whitespace-nowrap">Senior Analyst</div>
            </div>
            
            <LogOut size={16} className={`text-neutral-500 hover:text-white cursor-pointer flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`} />
          </div>
        </div>
      </aside>

      {/* Main Content with Transition Wrapper */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-paper">
        {/* We use a key on the wrapper div to force re-mounting and trigger the entry animation on page change */}
        <div key={activePage} className="flex-1 overflow-hidden animate-enter">
            {children}
        </div>
      </main>
    </div>
  );
};