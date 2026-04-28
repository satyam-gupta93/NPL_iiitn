import { Gavel } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const TeamPanel = ({ team, isHighest, disabled, onBid }) => (
  <article
    className={`rounded-md border-2 bg-background p-4 ${
      isHighest ? 'winner-pulse border-accent' : 'border-primary'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-black">{team.name}</h3>
        <p className="mt-1 text-sm font-bold text-accent">{formatCurrency(team.purse)}</p>
      </div>
      {isHighest && (
        <span className="rounded-md border-2 border-accent bg-accent px-2 py-1 text-xs font-black text-background">
          Highest
        </span>
      )}
    </div>
    <p className="mt-3 text-sm font-bold text-secondary">{team.players?.length || 0} players bought</p>
    <button
      type="button"
      onClick={() => onBid(team._id)}
      disabled={disabled}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border-2 border-primary bg-primary px-4 py-3 font-black text-background disabled:border-primary disabled:bg-background disabled:text-primary"
    >
      <Gavel size={18} />
      Bid
    </button>
  </article>
);

export default TeamPanel;
