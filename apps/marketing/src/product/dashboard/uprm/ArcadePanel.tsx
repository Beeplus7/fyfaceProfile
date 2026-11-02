import { Link } from 'react-router-dom';
import { ARCADE_GAMES } from '../../arcade/mfcEconomy';
import { CRM_BTN_GHOST, CRM_CARD, CRM_CARD_IN, CRM_EYE } from '../../crmChrome';

/** Compact arcade tile. */
export function ArcadePanel() {
  return (
    <div className={`${CRM_CARD} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <div className={CRM_EYE}>Games Arcade</div>
        <span className="mono text-[10px] text-white/40">{ARCADE_GAMES.length} playable</span>
      </div>
      <p className="mt-2 mono text-[11px] text-white/45 leading-5">
        Gift Rain · Lace Clash · Raid · Quote Royale · Cosmic · Multiplayer
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {ARCADE_GAMES.slice(0, 4).map((g) => (
          <Link key={g.id} to={`/app/arcade/${g.id}`} className={`${CRM_CARD_IN} px-2.5 py-2.5 hover:bg-white/[0.06]`}>
            <div className="text-[12px] font-semibold text-white leading-tight">{g.title}</div>
            <div className="mono text-[10px] text-white/40 mt-1 truncate">{g.streamHint}</div>
          </Link>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link to="/app/dashboard?pane=games" className={CRM_BTN_GHOST}>
          All games
        </Link>
        <Link to="/app/dashboard?pane=adrev" className={CRM_BTN_GHOST}>
          Ad revenue
        </Link>
      </div>
    </div>
  );
}

export default ArcadePanel;
