import Team from '../models/Team.js';

export const getTeams = async (req, res) => {
  const teams = await Team.find().populate('players.player').sort({ name: 1 });
  res.json(teams);
};

export const getTeamById = async (req, res) => {
  const team = await Team.findById(req.params.id).populate('players.player');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  res.json(team);
};
