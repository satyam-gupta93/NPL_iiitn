import mongoose from 'mongoose';
import Auction from '../models/Auction.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { BID_INCREMENT, getAuctionState } from '../utils/auctionState.js';
import { formatCurrency } from '../utils/format.js';

const emitAuctionUpdate = async (req) => {
  const io = req.app.get('io');
  if (io) {
    const [auction, players, teams] = await Promise.all([
      getAuctionState(),
      Player.find().populate('soldTo').sort({ isSold: 1, name: 1 }),
      Team.find().populate('players.player').sort({ name: 1 })
    ]);
    io.emit('auction:update', { auction, players, teams });
  }
};

export const getAuction = async (req, res) => {
  const auction = await getAuctionState();
  res.json({ auction, bidIncrement: BID_INCREMENT });
};

export const startAuction = async (req, res) => {
  const { playerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playerId)) {
    res.status(400);
    throw new Error('Valid playerId is required');
  }

  const player = await Player.findById(playerId);
  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  if (player.isSold) {
    res.status(400);
    throw new Error('Cannot start auction for a sold player');
  }

  const auction = await getAuctionState();
  auction.currentPlayer = player._id;
  auction.currentBid = player.basePrice;
  auction.highestBidder = null;
  auction.lastBidTeam = null;
  auction.status = 'LIVE';
  auction.history.push({
    player: player._id,
    action: 'STARTED',
    amount: player.basePrice,
    message: `${player.name} opened at ${formatCurrency(player.basePrice)}`
  });
  await auction.save();

  await emitAuctionUpdate(req);
  res.json(await getAuctionState());
};

export const placeBid = async (req, res) => {
  const { teamId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    res.status(400);
    throw new Error('Valid teamId is required');
  }

  const auction = await getAuctionState();
  if (auction.status !== 'LIVE' || !auction.currentPlayer) {
    res.status(400);
    throw new Error('No live auction is running');
  }

  const [player, team] = await Promise.all([
    Player.findById(auction.currentPlayer._id),
    Team.findById(teamId)
  ]);

  if (!player || player.isSold) {
    res.status(400);
    throw new Error('Cannot bid on a sold or missing player');
  }

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (auction.lastBidTeam?.toString() === team._id.toString()) {
    res.status(400);
    throw new Error('Duplicate consecutive bids are not allowed');
  }

  const nextBid = auction.highestBidder ? auction.currentBid + BID_INCREMENT : auction.currentBid;
  if (team.purse < nextBid) {
    res.status(400);
    throw new Error('Team purse is not enough for this bid');
  }

  auction.currentBid = nextBid;
  auction.highestBidder = team._id;
  auction.lastBidTeam = team._id;
  auction.history.push({
    player: player._id,
    team: team._id,
    action: 'BID',
    amount: nextBid,
    message: `${team.name} bid ${formatCurrency(nextBid)} for ${player.name}`
  });
  await auction.save();

  await emitAuctionUpdate(req);
  res.json(await getAuctionState());
};

export const acceptBid = async (req, res) => {
  const auction = await getAuctionState();
  if (auction.status !== 'LIVE' || !auction.currentPlayer) {
    res.status(400);
    throw new Error('No live auction is running');
  }

  if (!auction.highestBidder) {
    res.status(400);
    throw new Error('No bid has been placed yet');
  }

  const [player, team] = await Promise.all([
    Player.findById(auction.currentPlayer._id),
    Team.findById(auction.highestBidder._id)
  ]);

  if (!player || player.isSold) {
    res.status(400);
    throw new Error('Player is already sold or missing');
  }

  if (!team || team.purse < auction.currentBid) {
    res.status(400);
    throw new Error('Winning team cannot afford this bid');
  }

  player.isSold = true;
  player.soldTo = team._id;
  player.soldPrice = auction.currentBid;
  team.purse -= auction.currentBid;
  team.players.push({ player: player._id, price: auction.currentBid });

  auction.history.push({
    player: player._id,
    team: team._id,
    action: 'ACCEPTED',
    amount: auction.currentBid,
    message: `${player.name} sold to ${team.name} for ${formatCurrency(auction.currentBid)}`
  });
  auction.status = 'SOLD';
  auction.currentPlayer = null;
  auction.currentBid = 0;
  auction.highestBidder = null;
  auction.lastBidTeam = null;

  await Promise.all([player.save(), team.save(), auction.save()]);

  await emitAuctionUpdate(req);
  res.json(await getAuctionState());
};

export const rejectBid = async (req, res) => {
  const auction = await getAuctionState();
  if (auction.status !== 'LIVE' || !auction.currentPlayer) {
    res.status(400);
    throw new Error('No live auction is running');
  }

  const player = await Player.findById(auction.currentPlayer._id);
  auction.history.push({
    player: player?._id,
    action: 'REJECTED',
    amount: auction.currentBid,
    message: `${player?.name || 'Player'} auction rejected`
  });
  auction.status = 'REJECTED';
  auction.currentPlayer = null;
  auction.currentBid = 0;
  auction.highestBidder = null;
  auction.lastBidTeam = null;
  await auction.save();

  await emitAuctionUpdate(req);
  res.json(await getAuctionState());
};
