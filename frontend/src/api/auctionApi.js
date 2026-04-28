import { api } from './client';

export const getPlayers = () => api.get('/players').then((res) => res.data);
export const getAvailablePlayers = () => api.get('/players/available').then((res) => res.data);
export const getTeams = () => api.get('/teams').then((res) => res.data);
export const getAuction = () => api.get('/auction').then((res) => res.data);

export const startAuction = (playerId) =>
  api.post('/auction/start', { playerId, role: 'auctioneer' }).then((res) => res.data);

export const placeBid = (teamId) =>
  api.post('/auction/bid', { teamId }).then((res) => res.data);

export const acceptBid = () =>
  api.post('/auction/accept', { role: 'auctioneer' }).then((res) => res.data);

export const rejectBid = () =>
  api.post('/auction/reject', { role: 'auctioneer' }).then((res) => res.data);
