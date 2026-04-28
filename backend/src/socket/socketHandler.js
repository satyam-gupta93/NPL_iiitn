import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { BID_INCREMENT, getAuctionState } from '../utils/auctionState.js';

export const registerSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    try {
      const [auction, players, teams] = await Promise.all([
        getAuctionState(),
        Player.find().populate('soldTo').sort({ isSold: 1, name: 1 }),
        Team.find().populate('players.player').sort({ name: 1 })
      ]);

      socket.emit('auction:update', {
        auction,
        players,
        teams,
        bidIncrement: BID_INCREMENT
      });
    } catch (error) {
      console.error('Socket initial sync failed:', error.message);
      socket.emit('auction:error', {
        message: 'Database sync failed. Check MongoDB Atlas network access and TLS connectivity.'
      });
    }
  });
};
