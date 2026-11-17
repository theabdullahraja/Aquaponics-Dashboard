import { Home, BarChart3, Bell, Bot, Settings, Sparkles } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  alertCount?: number;
}

export function MobileNav({ currentView, onViewChange, alertCount = 0 }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'advisory', icon: Sparkles, label: 'Advisor' },
    { id: 'alerts', icon: Bell, label: 'Alerts', badge: alertCount },
    { id: 'ai', icon: Bot, label: 'AI' },
    { id: 'settings', icon: Settings, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border-subtle z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 relative"
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-aqua-blue rounded-full" />
              )}

              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-aqua-blue' : 'text-muted-foreground'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-red rounded-full text-white text-xs flex items-center justify-center font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-aqua-blue' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
