import { Wifi, WifiOff } from 'lucide-react';
import { useLatestReading, useSystemOnline } from '../../lib/useAquaponics';

/** Live "System Online / Offline" badge driven by the freshness of the latest reading.
 *  Colorblind-safe: distinct icon + text label, not color alone. */
export function SystemStatusBadge() {
  const reading = useLatestReading();
  const online = useSystemOnline(reading);

  const ageSec = reading ? Math.max(0, Math.round((Date.now() - new Date(reading.ts).getTime()) / 1000)) : null;
  const ageText =
    ageSec == null ? 'no data' : ageSec < 60 ? `${ageSec}s ago` : ageSec < 3600 ? `${Math.round(ageSec / 60)}m ago` : ageSec < 86400 ? `${Math.round(ageSec / 3600)}h ago` : `${Math.round(ageSec / 86400)}d ago`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${
        online
          ? 'border-green-growth/30 bg-green-growth/10 text-green-growth'
          : 'border-danger-red/30 bg-danger-red/10 text-danger-red'
      }`}
      title={reading ? `Last reading ${ageText}` : 'No readings received'}
    >
      {online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
      {online ? (
        <>
          <span className="hidden sm:inline">System&nbsp;</span>Online
        </>
      ) : (
        'Offline'
      )}
      <span className="hidden font-normal opacity-70 sm:inline">· {ageText}</span>
    </span>
  );
}
