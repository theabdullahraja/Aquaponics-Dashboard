import { Waves, Wind, AlertCircle, RotateCw, TestTube } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '../components/ui/switch';

export function ControlPanel() {
  const [waterPumpOn, setWaterPumpOn] = useState(false);
  const [airPumpOn, setAirPumpOn] = useState(true);

  const quickActions = [
    { icon: AlertCircle, label: 'Emergency Stop', variant: 'danger' },
    { icon: RotateCw, label: 'Cycle Pumps', variant: 'secondary' },
    { icon: TestTube, label: 'Test All', variant: 'secondary' },
  ];

  return (
    <div className="bg-card rounded-lg p-5 border border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Manual Actuator Controls</h3>
          <p className="text-sm text-muted-foreground mt-1">Commands are written to Firebase and confirmed by ESP32-S3.</p>
        </div>
        <span className="rounded-md border border-aqua-blue/25 bg-aqua-blue/10 px-3 py-1 text-xs font-semibold text-aqua-blue">
          User initiated only
        </span>
      </div>

      <div className="space-y-6">
        {/* Water Pump */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                waterPumpOn ? 'bg-aqua-blue/15' : 'bg-surface-dark'
              }`}
            >
              <Waves
                className={`w-6 h-6 transition-colors ${
                  waterPumpOn ? 'text-aqua-blue' : 'text-muted-foreground'
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">Water Pump</p>
              <p className="text-sm text-muted-foreground">
                {waterPumpOn ? 'Running for: 24m' : 'Last activated: 2h ago'}
              </p>
            </div>
          </div>
          <Switch checked={waterPumpOn} onCheckedChange={setWaterPumpOn} />
        </div>

        {/* Air Pump */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                airPumpOn ? 'bg-green-growth/15' : 'bg-surface-dark'
              }`}
            >
              <Wind
                className={`w-6 h-6 transition-colors ${
                  airPumpOn ? 'text-green-growth' : 'text-muted-foreground'
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">Air Pump</p>
              <p className="text-sm text-muted-foreground">
                {airPumpOn ? 'Running for: 3h 24m' : 'Last activated: 1h ago'}
              </p>
            </div>
          </div>
          <Switch checked={airPumpOn} onCheckedChange={setAirPumpOn} />
        </div>

        {/* Quick Actions */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-foreground mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                    action.variant === 'danger'
                      ? 'border-danger-red/30 text-danger-red hover:bg-danger-red/10'
                      : 'border-border-subtle text-foreground hover:bg-surface-dark'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
