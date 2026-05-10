import { useState } from 'react';
import { Bell, Settings, Bot } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { HeroStatsCards } from './components/HeroStatsCards';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { SystemHealth } from './components/SystemHealth';
import { ControlPanel } from './components/ControlPanel';
import { AlertFeed } from './components/AlertFeed';
import { AIChatbot } from './components/AIChatbot';
import { LandingPage } from './components/landing/LandingPage';

export default function App() {
  const [page, setPage] = useState<'landing' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const alertCount = 3;

  const handleViewChange = (view: string) => {
    if (view === 'ai') {
      setIsChatbotOpen(true);
      setCurrentView('dashboard');
    } else {
      setCurrentView(view);
    }
  };

  if (page === 'landing') {
    return (
      <LandingPage
        onOpenDashboard={() => setPage('dashboard')}
        onOpenAI={() => {
          setPage('dashboard');
          setIsChatbotOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Sidebar - Desktop only */}
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} alertCount={alertCount} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={handleViewChange} alertCount={alertCount} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isChatbotOpen ? 'lg:ml-[280px] lg:mr-[360px]' : 'lg:ml-[280px]'}`}>
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 lg:h-20 bg-card/95 backdrop-blur-lg border-b border-border-subtle z-30 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground">System Overview</h1>
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
                onClick={() => setPage('landing')}
                className="hidden sm:block px-3 py-2 text-sm rounded-lg border border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-dark transition"
              >
                Landing
              </button>
              <button className="relative p-2 lg:p-2.5 hover:bg-surface-dark rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {alertCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-red rounded-full" />
                )}
              </button>

              <button
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className={`p-2 lg:p-2.5 rounded-xl transition-all hidden lg:flex ${
                  isChatbotOpen
                    ? 'bg-aqua-blue text-white'
                    : 'hover:bg-surface-dark text-muted-foreground'
                }`}
              >
                <Bot className="w-5 h-5" />
              </button>

              <button className="p-2 lg:p-2.5 hover:bg-surface-dark rounded-xl transition-colors hidden sm:block">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>

              <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-aqua-blue to-green-growth flex items-center justify-center text-white font-semibold text-sm">
                JD
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="pt-20 lg:pt-24 px-4 lg:px-8 pb-12 space-y-6 lg:space-y-8">
          {currentView === 'dashboard' && (
            <>
              {/* Hero Stats */}
              <HeroStatsCards />

              {/* Real-Time Monitor & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RealTimeMonitor />
                </div>
                <div>
                  <SystemHealth />
                </div>
              </div>

              {/* Control Panel */}
              <ControlPanel />

              {/* Alert Feed */}
              <AlertFeed />
            </>
          )}

          {currentView === 'analytics' && (
            <div className="bg-card rounded-2xl p-12 border border-border-subtle text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-4">Analytics View</h2>
              <p className="text-muted-foreground">
                Detailed analytics and historical data visualization will appear here.
              </p>
            </div>
          )}

          {currentView === 'alerts' && (
            <div className="bg-card rounded-2xl p-12 border border-border-subtle text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-4">All Alerts</h2>
              <p className="text-muted-foreground">
                Complete alert history and management will appear here.
              </p>
            </div>
          )}

          {currentView === 'history' && (
            <div className="bg-card rounded-2xl p-12 border border-border-subtle text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-4">System History</h2>
              <p className="text-muted-foreground">
                Timeline view of all system events and changes will appear here.
              </p>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="bg-card rounded-2xl p-12 border border-border-subtle text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-4">Settings</h2>
              <p className="text-muted-foreground">
                System configuration and preferences will appear here.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-aqua-blue rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
