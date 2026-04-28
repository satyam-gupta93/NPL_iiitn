import { Check, Timer, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { acceptBid, placeBid, rejectBid, startAuction } from '../api/auctionApi';
import TeamPanel from '../components/TeamPanel';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../utils/currency';

const AuctionRoom = () => {
  const { players, teams, auction, bidIncrement, error, setError } = useAuction();
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const availablePlayers = useMemo(() => players.filter((player) => !player.isSold), [players]);
  const currentPlayer = auction?.currentPlayer;
  const highestBidderId = auction?.highestBidder?._id;
  const hasLiveAuction = auction?.status === 'LIVE' && currentPlayer;

  useEffect(() => {
    if (!hasLiveAuction) {
      setSecondsLeft(60);
      return undefined;
    }

    setSecondsLeft(60);
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentPlayer?._id, hasLiveAuction]);

  const runAction = async (action) => {
    try {
      setBusy(true);
      setError('');
      await action();
    } catch (err) {
      setError(err.response?.data?.message || 'Auction action failed');
    } finally {
      setBusy(false);
    }
  };

  const handleStart = () => {
    if (!selectedPlayer) {
      setError('Select a player before starting the auction');
      return;
    }
    runAction(() => startAuction(selectedPlayer));
  };

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-bold text-secondary">Live Bidding</p>
          <h2 className="text-2xl font-black sm:text-3xl">Auction Room</h2>
        </div>
        <div className="flex items-center gap-2 rounded-md border-2 border-secondary px-4 py-3 font-black text-secondary">
          <Timer size={18} />
          {secondsLeft}s
        </div>
      </div>

      {error && <p className="mt-5 rounded-md border-2 border-secondary p-3 font-bold text-secondary">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-md border-2 border-primary bg-background p-5">
          <p className="font-bold text-secondary">Auctioneer Panel</p>
          <h3 className="mt-2 text-xl font-black">Select Player</h3>
          <select
            value={selectedPlayer}
            onChange={(event) => setSelectedPlayer(event.target.value)}
            disabled={hasLiveAuction}
            className="mt-4 w-full rounded-md border-2 border-primary bg-background px-4 py-3 font-bold text-primary outline-none"
          >
            <option value="">Choose available player</option>
            {availablePlayers.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name} - {formatCurrency(player.basePrice)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStart}
            disabled={busy || hasLiveAuction}
            className="mt-4 w-full rounded-md border-2 border-primary bg-primary px-4 py-3 font-black text-background disabled:bg-background disabled:text-primary"
          >
            Start Auction
          </button>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => runAction(acceptBid)}
              disabled={busy || !hasLiveAuction || !highestBidderId}
              className="flex items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent px-4 py-3 font-black text-background disabled:bg-background disabled:text-accent"
            >
              <Check size={18} />
              Accept Bid
            </button>
            <button
              type="button"
              onClick={() => runAction(rejectBid)}
              disabled={busy || !hasLiveAuction}
              className="flex items-center justify-center gap-2 rounded-md border-2 border-secondary bg-secondary px-4 py-3 font-black text-primary disabled:bg-background disabled:text-secondary"
            >
              <X size={18} />
              Reject Bid
            </button>
          </div>
        </div>

        <div className="rounded-md border-2 border-primary bg-background p-5">
          <p className="font-bold text-secondary">Current Player</p>
          {currentPlayer ? (
            <div className="mt-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black">{currentPlayer.name}</h3>
                  <p className="mt-1 font-bold text-accent">{currentPlayer.skill}</p>
                </div>
                <p className="rounded-md border-2 border-primary px-3 py-2 font-black">
                  Base {formatCurrency(currentPlayer.basePrice)}
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border-2 border-primary p-4">
                  <p className="font-bold text-secondary">Live Bid</p>
                  <p className="mt-2 text-3xl font-black">{formatCurrency(auction.currentBid)}</p>
                </div>
                <div className="rounded-md border-2 border-accent p-4">
                  <p className="font-bold text-secondary">Highest Bidder</p>
                  <p className="mt-2 text-2xl font-black text-accent">
                    {auction.highestBidder?.name || 'Waiting'}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-secondary">
                Bid increment: {formatCurrency(bidIncrement)}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-md border-2 border-primary p-6 text-center font-bold">
              No live player selected
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => (
          <TeamPanel
            key={team._id}
            team={team}
            isHighest={highestBidderId === team._id}
            disabled={busy || !hasLiveAuction || highestBidderId === team._id}
            onBid={(teamId) => runAction(() => placeBid(teamId))}
          />
        ))}
      </div>

      <div className="mt-6 rounded-md border-2 border-primary bg-background p-5">
        <h3 className="font-black">Auction History</h3>
        <div className="mt-4 grid gap-3">
          {(auction?.history || [])
            .slice()
            .reverse()
            .slice(0, 8)
            .map((item, index) => (
              <p key={`${item.createdAt}-${index}`} className="rounded-md border-2 border-primary p-3 text-sm font-bold">
                {item.message}
              </p>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AuctionRoom;
