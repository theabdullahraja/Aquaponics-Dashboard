import { Home, BarChart3, Settings, Bell, Clock, Bot, Menu, Sparkles } from 'lucide-react';
import { HeaderBrand } from './HeaderBrand';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  alertCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onGoLanding: () => void;
  online?: boolean;
}

// Each destination owns an accent colour, so places are recognisable at a glance
// (shape + label always carry the meaning, colour only helps).
const GROUPS = [
  {
    title: 'Monitor',
    items: [
      { id: 'dashboard', icon: Home, label: 'Dashboard', color: '#a78bfa' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics', color: '#4dd0e1' },
      { id: 'history', icon: Clock, label: 'Past Data', color: '#ff9f6b' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'advisory', icon: Sparkles, label: 'AI Advisory', color: '#f472b6' },
      { id: 'ai', icon: Bot, label: 'AI Assistant', color: '#4ade80' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'alerts', icon: Bell, label: 'Alerts', color: '#fbbf24' },
      { id: 'settings', icon: Settings, label: 'Settings', color: '#94a3b8' },
    ],
  },
];

export function Sidebar({ currentView, onViewChange, alertCount = 0, isCollapsed, onToggleCollapse, onGoLanding, online = false }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? 'w-[60px]' : 'w-[280px]'}`}
      style={{ background: 'linear-gradient(180deg, #2a1659 0%, #1c1236 45%, #130d28 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute -left-10 top-24 h-48 w-48 rounded-full bg-[#f472b6]/10 blur-3xl" />

      {/* Brand */}
      <div className="relative flex h-20 shrink-0 items-center border-b border-white/10 px-4">
        {!isCollapsed && <HeaderBrand onClick={onGoLanding} bare />}
        <button onClick={onToggleCollapse} aria-label="Toggle sidebar" className="ml-auto rounded-lg p-2 transition-colors hover:bg-white/10">
          <Menu className="h-5 w-5 text-white/70" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-5 overflow-y-auto p-3">
        {GROUPS.map((g) => (
          <div key={g.title}>
            {!isCollapsed && <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{g.title}</p>}
            <div className="space-y-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                const badge = item.id === 'alerts' ? alertCount : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all duration-200 ${active ? 'text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'}`}
                    style={active ? { background: `linear-gradient(90deg, ${item.color}30, ${item.color}08)`, boxShadow: `inset 0 0 0 1px ${item.color}40` } : undefined}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${item.color}${active ? '33' : '1f'}`, color: item.color }}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium">{item.label}</span>
                        {'tag' in item && item.tag && (
                          <span className="rounded-full bg-[#f472b6]/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#f9a8d4]">{item.tag}</span>
                        )}
                        {badge > 0 && (
                          <span className="ml-auto rounded-full bg-danger-red px-2 py-0.5 text-xs font-semibold text-[#1a0a10]">{badge}</span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: device + operator */}
      {!isCollapsed && (
        <div className="relative shrink-0 space-y-3 border-t border-white/10 p-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5 text-sm">
            <span className={`h-2 w-2 rounded-full ${online ? 'animate-pulse bg-[#4ade80]' : 'bg-danger-red'}`} />
            <span className="text-white/80">{online ? 'Device online' : 'Device offline'}</span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-white/40">ESP32-S3</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#f472b6] font-semibold text-white">AK</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Abdullah Khan</p>
              <p className="text-xs text-white/50">System Operator</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
