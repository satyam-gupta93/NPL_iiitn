import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuction, getPlayers, getTeams } from '../api/auctionApi';
import { socket } from '../socket';

const AuctionContext = createContext(null);

export const AuctionProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [auction, setAuction] = useState(null);
  const [bidIncrement, setBidIncrement] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  const refresh = async () => {
    try {
      setError('');
      const [playersData, teamsData, auctionData] = await Promise.all([
        getPlayers(),
        getTeams(),
        getAuction()
      ]);
      setPlayers(playersData);
      setTeams(teamsData);
      setAuction(auctionData.auction);
      setBidIncrement(auctionData.bidIncrement || 50000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load auction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    socket.connect();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('auction:error', (payload) => {
      setError(payload.message || 'Real-time sync failed');
    });
    socket.on('auction:update', (payload) => {
      if (payload.players) setPlayers(payload.players);
      if (payload.teams) setTeams(payload.teams);
      if (payload.auction) setAuction(payload.auction);
      if (payload.bidIncrement) setBidIncrement(payload.bidIncrement);
      setLoading(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('auction:error');
      socket.off('auction:update');
      socket.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      players,
      teams,
      auction,
      bidIncrement,
      loading,
      error,
      connected,
      refresh,
      setError
    }),
    [players, teams, auction, bidIncrement, loading, error, connected]
  );

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
};

export const useAuction = () => useContext(AuctionContext);
