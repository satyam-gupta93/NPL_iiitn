import { formatCurrency } from '../utils/currency';
import StatusBadge from './StatusBadge';

const PlayerCard = ({ player, action }) => (
  <article className="rounded-md border-2 border-primary bg-background p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-black">{player.name}</h2>
        <p className="mt-1 text-sm font-bold text-accent">{player.skill}</p>
      </div>
      <StatusBadge sold={player.isSold} />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-md border-2 border-primary p-3">
        <p className="font-bold text-secondary">Base</p>
        <p className="mt-1 font-black">{formatCurrency(player.basePrice)}</p>
      </div>
      <div className="rounded-md border-2 border-primary p-3">
        <p className="font-bold text-secondary">Sold Price</p>
        <p className="mt-1 font-black">{player.isSold ? formatCurrency(player.soldPrice) : '-'}</p>
      </div>
    </div>
    {player.soldTo && (
      <p className="mt-4 rounded-md border-2 border-accent p-3 text-sm font-bold text-accent">
        Sold to {player.soldTo.name}
      </p>
    )}
    {action}
  </article>
);

export default PlayerCard;
