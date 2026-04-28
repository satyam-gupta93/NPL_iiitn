import { RefreshCw } from 'lucide-react';
import PlayerCard from '../components/PlayerCard';
import { useAuction } from '../context/AuctionContext';

const Dashboard = () => {
  const { players, loading, error, refresh } = useAuction();
  const soldCount = players.filter((player) => player.isSold).length;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-bold text-secondary">Player Management</p>
          <h2 className="text-2xl font-black sm:text-3xl">Dashboard</h2>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center justify-center gap-2 rounded-md border-2 border-primary bg-primary px-4 py-3 font-black text-background"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && <p className="mt-5 rounded-md border-2 border-secondary p-3 font-bold text-secondary">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border-2 border-primary bg-background p-4">
          <p className="font-bold text-secondary">Total Players</p>
          <p className="mt-2 text-3xl font-black">{players.length}</p>
        </div>
        <div className="rounded-md border-2 border-primary bg-background p-4">
          <p className="font-bold text-secondary">Available</p>
          <p className="mt-2 text-3xl font-black">{players.length - soldCount}</p>
        </div>
        <div className="rounded-md border-2 border-primary bg-background p-4">
          <p className="font-bold text-secondary">Sold</p>
          <p className="mt-2 text-3xl font-black">{soldCount}</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 font-bold">Loading players...</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
