import { LayoutDashboard, Bot } from 'lucide-react';
import { FeatureTiles } from './FeatureTiles';
import { AnimatedStats } from './AnimatedStats';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenAI: () => void;
}

export function LandingPage({ onOpenDashboard, onOpenAI }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        .blob-1 { animation: float 8s ease-in-out infinite; }
        .blob-2 { animation: float-reverse 10s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        {/* Animated background blobs */}
        <div
          className="blob-1 absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="blob-2 absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-aqua-blue/30 bg-aqua-blue/10 mb-8">
            <span className="w-2 h-2 bg-aqua-blue rounded-full animate-pulse" />
            <span className="text-sm text-aqua-blue font-medium">12 sensors live</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span className="block text-foreground">Smart</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Aquaponics
            </span>
            <span className="block text-foreground">Dashboard</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-10">
            Monitor water quality, control your system, and get AI-powered guidance — all from one
            clean interface.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onOpenDashboard}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-aqua-blue text-white font-semibold hover:opacity-90 transition-all text-base"
              style={{ boxShadow: '0 8px 32px rgba(14,165,233,0.25)' }}
            >
              <LayoutDashboard className="w-5 h-5" />
              Open Dashboard
            </button>
            <button
              onClick={onOpenAI}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border-subtle text-foreground font-semibold hover:bg-surface-dark transition-all text-base"
            >
              <Bot className="w-5 h-5" />
              Try AI Assistant
            </button>
          </div>

          {/* Animated stats */}
          <AnimatedStats />
        </div>
      </section>

      {/* Feature Tiles Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
              What you get
            </p>
            <h2 className="text-3xl font-bold text-foreground">Everything to run your system</h2>
          </div>
          <FeatureTiles />
        </div>
      </section>

      {/* Bottom strip */}
      <div className="py-8 border-t border-border-subtle text-center">
        <p className="text-sm text-muted-foreground">
          Built for aquaponics operators · Open source demo · Hosted on Vercel
        </p>
      </div>
    </div>
  );
}
