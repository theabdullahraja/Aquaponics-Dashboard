import { Waves, Wind, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Switch } from '../components/ui/switch';
import {
  useActuatorStatus,
  setPumpCommand,
  type ActuatorTarget,
} from '../../lib/useAquaponics';

export function ControlPanel() {
  const status = useActuatorStatus();
  // Optimistic "desired" per pump while we wait for the ESP to confirm via actuator_status.
  const [pending, setPending] = useState<Partial<Record<ActuatorTarget, boolean>>>({});

  const waterReported = status.water_pump?.state ?? false;
  const airReported = status.air_pump?.state ?? false;

  // Clear the pending flag once the reported (confirmed) state matches what we asked for.
  useEffect(() => {
    setPending((p) => {
      const next = { ...p };
      if (p.water_pump !== undefined && p.water_pump === waterReported) delete next.water_pump;
      if (p.air_pump !== undefined && p.air_pump === airReported) delete next.air_pump;
      return next;
    });
  }, [waterReported, airReported]);

  const toggle = async (target: ActuatorTarget, reported: boolean) => {
    const current = pending[target] ?? reported;
    const next = !current;
    setPending((p) => ({ ...p, [target]: next }));
    const { error } = await setPumpCommand(target, next);
    if (error) {
      console.error('setPumpCommand failed', error);
      setPending((p) => {
        const n = { ...p };
        delete n[target];
        return n;
      });
    }
  };

  const emergencyStop = async () => {
    setPending({ water_pump: false, air_pump: false });
    await Promise.all([setPumpCommand('water_pump', false), setPumpCommand('air_pump', false)]);
  };

  // Static class strings (Tailwind can't generate classes built from template literals).
  const pumps: {
    target: ActuatorTarget;
    label: string;
    reported: boolean;
    Icon: typeof Waves;
    wrapOn: string;
    iconOn: string;
  }[] = [
    {
      target: 'water_pump',
      label: 'Water Pump',
      reported: waterReported,
      Icon: Waves,
      wrapOn: 'bg-aqua-blue/15',
      iconOn: 'text-aqua-blue',
    },
    {
      target: 'air_pump',
      label: 'Air Pump',
      reported: airReported,
      Icon: Wind,
      wrapOn: 'bg-green-growth/15',
      iconOn: 'text-green-growth',
    },
  ];

  return (
    <div className="bg-card rounded-lg p-5 border border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Manual Actuator Controls</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Commands are written to Supabase and confirmed by ESP32-S3.
          </p>
        </div>
        <span className="rounded-md border border-aqua-blue/25 bg-aqua-blue/10 px-3 py-1 text-xs font-semibold text-aqua-blue">
          User initiated only
        </span>
      </div>

      <div className="space-y-6">
        {pumps.map(({ target, label, reported, Icon, wrapOn, iconOn }) => {
          const isPending = pending[target] !== undefined && pending[target] !== reported;
          const shown = pending[target] ?? reported;
          return (
            <div
              key={target}
              className="flex items-center justify-between pb-6 border-b border-border-subtle"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    reported ? wrapOn : 'bg-surface-dark'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      reported ? iconOn : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Confirming with ESP32…
                      </>
                    ) : reported ? (
                      '● Running'
                    ) : (
                      '○ Off'
                    )}
                  </p>
                </div>
              </div>
              <Switch checked={shown} onCheckedChange={() => toggle(target, reported)} />
            </div>
          );
        })}

        {/* Quick Actions */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-foreground mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={emergencyStop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-danger-red/30 text-danger-red hover:bg-danger-red/10 transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Stop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
