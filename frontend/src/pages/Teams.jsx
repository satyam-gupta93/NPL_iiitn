import { Shield } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../utils/currency';

const Teams = () => {
  const { teams, loading } = useAuction();

  return (
    <section>
      <div>
        <p className="font-bold text-secondary">Team Management</p>
        <h2 className="text-2xl font-black sm:text-3xl">Squads & Purse</h2>
      </div>

      {loading ? (
        <p className="mt-8 font-bold">Loading teams...</p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {teams.map((team) => (
            <article key={team._id} className="rounded-md border-2 border-primary bg-background p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black">{team.name}</h3>
                  <p className="mt-1 font-bold text-accent">Remaining {formatCurrency(team.purse)}</p>
                </div>
                <div className="rounded-md border-2 border-secondary p-3 text-secondary">
                  <Shield size={24} />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {team.players?.length ? (
                  team.players.map((entry) => (
                    <div
                      key={entry.player?._id || entry.player}
                      className="flex flex-col gap-2 rounded-md border-2 border-primary p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-black">{entry.player?.name}</p>
                        <p className="text-sm font-bold text-accent">{entry.player?.skill}</p>
                      </div>
                      <p className="font-black text-secondary">{formatCurrency(entry.price)}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border-2 border-primary p-4 text-center font-bold">
                    Squad is waiting for first signing
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Teams;
