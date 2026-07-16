import { useState, useEffect } from 'react';
import { Bell, Settings, Bot, SlidersHorizontal, User, LogOut } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { HeroStatsCards } from './components/HeroStatsCards';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { SystemHealth } from './components/SystemHealth';
import { ControlPanel } from './components/ControlPanel';
import { AlertFeed } from './components/AlertFeed';
import { AIChatbot } from './components/AIChatbot';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SystemStatusBadge } from './components/SystemStatusBadge';
import { PastData } from './components/PastData';
import { Analytics } from './components/Analytics';
import { useLatestReading, useSystemOnline } from '../lib/useAquaponics';
import { alertsFromReading } from '../lib/health';
import { getSession, onAuthChange, signOut } from '../lib/auth';

export default function App() {
  const [page, setPage] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Let us keep your aquaponics system healthy and stable today.',
  );
  const [authed, setAuthed] = useState(false);
  const latestReading = useLatestReading();
  const online = useSystemOnline(latestReading);
  const alertCount = alertsFromReading(latestReading, online).length;

  // Restore a persisted Supabase session on refresh; kick back to login if it ends.
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setAuthed(true);
        setPage((p) => (p === 'login' ? 'dashboard' : p));
      }
    });
    return onAuthChange((session) => {
      setAuthed(!!session);
      if (!session) setPage((p) => (p === 'dashboard' ? 'login' : p));
    });
  }, []);

  const greetings = [
    'Your sensors are live and your controls are ready.',
    'Great to see you again. Let us check system health together.',
    'Today looks good for monitoring and quick maintenance checks.',
  ];

  const handleViewChange = (view: string) => {
    if (view === 'ai') {
      setIsChatbotOpen(true);
      setCurrentView('dashboard');
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setWelcomeMessage(randomGreeting);
    setPage('dashboard');
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setPage('login');
    setIsChatbotOpen(false);
    setIsUserMenuOpen(false);
  };

  if (page === 'landing') {
    return (
      <LandingPage
        onOpenDashboard={() => setPage(authed ? 'dashboard' : 'login')}
        onOpenAI={() => {
          setPage(authed ? 'dashboard' : 'login');
          setIsChatbotOpen(true);
        }}
      />
    );
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <div className="hidden lg:block">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          alertCount={alertCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onGoLanding={() => setPage('landing')}
          online={online}
        />
      </div>

      <MobileNav currentView={currentView} onViewChange={handleViewChange} alertCount={alertCount} />

      <div className={`transition-all duration-300 ${isChatbotOpen ? 'lg:mr-[360px]' : ''} ${isSidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[280px]'}`}>
        <header className={`fixed top-0 right-0 left-0 h-16 lg:h-20 bg-card/95 backdrop-blur-lg border-b border-border-subtle z-30 px-4 lg:px-8 transition-all duration-300 ${isSidebarCollapsed ? 'lg:left-[60px]' : 'lg:left-[280px]'}`}>
          <div className="h-full flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl lg:text-2xl font-semibold text-foreground">System Overview</h1>
                <SystemStatusBadge />
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setCurrentView('alerts')}
                aria-label="View alerts"
                className="relative p-2 lg:p-2.5 hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {alertCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-red rounded-full" />
                )}
              </button>

              <button
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className={`p-2 lg:p-2.5 rounded-xl transition-all hidden lg:flex ${
                  isChatbotOpen ? 'bg-aqua-blue text-white' : 'hover:bg-surface-dark text-muted-foreground'
                }`}
              >
                <Bot className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentView('settings')}
                aria-label="Open settings"
                className="p-2 lg:p-2.5 hover:bg-surface-dark rounded-xl transition-colors hidden sm:block"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-aqua-blue to-green-growth flex items-center justify-center text-primary-foreground font-semibold text-sm"
                >
                  AK
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border-subtle bg-card shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-sm text-left text-foreground hover:bg-surface-dark transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2.5 text-sm text-left text-danger-red hover:bg-danger-red/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 lg:pt-24 px-4 lg:px-8 pb-12 space-y-6 lg:space-y-8">
          {currentView === 'dashboard' && (
            <>
              <section className="rounded-lg border border-border-subtle bg-gradient-to-r from-card to-surface-dark p-5 lg:p-6">
                <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">Welcome Back Abdullah Khan</h2>
                <p className="mt-2 text-sm lg:text-base text-muted-foreground">{welcomeMessage}</p>
              </section>

              <HeroStatsCards />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RealTimeMonitor />
                </div>
                <div>
                  <SystemHealth />
                </div>
              </div>

              <ControlPanel />
              <AlertFeed />
            </>
          )}

          {currentView === 'analytics' && <Analytics />}

          {currentView === 'alerts' && <AlertFeed />}

          {currentView === 'history' && <PastData />}

          {currentView === 'settings' && (
            <div className="bg-card rounded-lg p-6 border border-border-subtle">
              <div className="flex items-center gap-3 mb-5">
                <SlidersHorizontal className="w-5 h-5 text-aqua-blue" />
                <h2 className="text-2xl font-semibold text-foreground">Threshold Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['pH safe range', '6.8 - 7.5'],
                  ['Temperature safe range', '20°C - 26°C'],
                  ['Minimum flow rate', '2.0 L/m'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-border-subtle bg-surface-dark p-4">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-lg font-mono font-semibold text-foreground mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-border-subtle bg-card p-6">
            <h3 className="text-xl font-semibold text-foreground">Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">Account and operator details</p>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg border border-border-subtle bg-surface-dark p-3">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-semibold text-foreground mt-1">Abdullah Khan</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface-dark p-3">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-semibold text-foreground mt-1">System Operator</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface-dark p-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground mt-1">abdullah.khan@aquaponics.local</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border-subtle text-foreground hover:bg-surface-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-aqua-blue rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
