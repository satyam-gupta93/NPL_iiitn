import Player from '../models/Player.js';

export const getPlayers = async (req, res) => {
  const players = await Player.find().populate('soldTo').sort({ isSold: 1, name: 1 });
  res.json(players);
};

export const getAvailablePlayers = async (req, res) => {
  const players = await Player.find({ isSold: false }).sort({ name: 1 });
  res.json(players);
};
