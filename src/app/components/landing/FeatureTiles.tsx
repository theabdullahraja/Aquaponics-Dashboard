import { Droplet, Zap, Bot } from 'lucide-react';

const tiles = [
  {
    icon: Droplet,
    title: 'Live Sensor Monitoring',
    desc: 'pH, temperature, water flow and level — tracked 24/7 with instant alerts.',
    color: '#0EA5E9',
  },
  {
    icon: Zap,
    title: 'Smart Control System',
    desc: 'Toggle pumps, run diagnostics, and automate cycles directly from your dashboard.',
    color: '#4dd0c4',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    desc: 'Ask anything about your system. Get expert guidance on fish care, plant health, and optimization.',
    color: '#F59E0B',
  },
];

export function FeatureTiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.title}
            className="bg-card rounded-2xl border border-border-subtle p-6 hover:border-aqua-blue/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${tile.color}15` }}
            >
              <Icon className="w-6 h-6" style={{ color: tile.color }} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">{tile.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{tile.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
