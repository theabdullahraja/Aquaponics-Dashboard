import { Home, BarChart3, Settings, Bell, Clock, Bot, Menu } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  alertCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onGoLanding: () => void;
}

export function Sidebar({
  currentView,
  onViewChange,
  alertCount = 0,
  isCollapsed,
  onToggleCollapse,
  onGoLanding,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'alerts', icon: Bell, label: 'Alerts', badge: alertCount },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'ai', icon: Bot, label: 'AI Assistant', highlight: true },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border-subtle transition-all duration-300 z-40 ${
        isCollapsed ? 'w-[60px]' : 'w-[280px]'
      }`}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-border-subtle bg-gradient-to-r from-aqua-blue/5 to-green-growth/5">
        {!isCollapsed && (
          <button onClick={onGoLanding} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aqua-blue to-green-growth flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" opacity="0.6"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground">AquaponicsAI</span>
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="ml-auto p-2 hover:bg-surface-dark rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative group ${
                isActive
                  ? 'bg-aqua-blue/10 text-aqua-blue'
                  : 'text-muted-foreground hover:bg-surface-dark hover:text-foreground'
              } ${item.highlight && !isActive ? 'hover:text-aqua-blue' : ''}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-aqua-blue rounded-r-full" />
              )}

              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-aqua-blue' : ''}`} />

              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-danger-red rounded-full text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-subtle space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-growth rounded-full animate-pulse" />
            <span className="text-muted-foreground">All Systems Normal</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aqua-blue to-green-growth flex items-center justify-center text-white font-semibold">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Abdullah Khan</p>
              <p className="text-xs text-muted-foreground">Last sync: 2m ago</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
