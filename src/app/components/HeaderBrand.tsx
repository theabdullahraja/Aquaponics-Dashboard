import { Sparkles } from 'lucide-react';

/** Droplet mark (same as the sidebar logo) with an electric bolt and twinkling sparks. */
export function HeaderBrand({ onClick, bare = false }: { onClick?: () => void; bare?: boolean }) {
  return (
    <button onClick={onClick} aria-label="AquaponicsAI home" className={`relative flex items-center gap-2.5 hover:opacity-90 transition-opacity ${bare ? '' : 'pr-4 mr-1'}`}>
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-aqua-blue to-aqua-blue-light flex items-center justify-center shadow-[0_0_18px_rgba(167,139,250,0.35)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" opacity="0.55" />
          <path className="brand-bolt" d="M13 6l-4.5 7h3L10.5 19 16 11.5h-3.2z" fill="#ffe27a" stroke="#fff3b0" strokeWidth="0.4" strokeLinejoin="round" />
        </svg>
        <Sparkles className="brand-spark absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[#ffe27a]" aria-hidden />
        <Sparkles className="brand-spark absolute -bottom-1 -left-1.5 w-2.5 h-2.5 text-aqua-blue-light" style={{ animationDelay: '1.1s' }} aria-hidden />
      </div>
      <div className={`${bare ? '' : 'hidden sm:block'} leading-tight text-left`}>
        <span className="brand-word block whitespace-nowrap text-lg font-bold tracking-tight">AquaponicsAI</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Smart · Live</span>
      </div>
    </button>
  );
}
