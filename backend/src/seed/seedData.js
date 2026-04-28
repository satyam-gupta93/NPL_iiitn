import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Auction from '../models/Auction.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { players, teams } from '../data/preloadedData.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([Player.deleteMany({}), Team.deleteMany({}), Auction.deleteMany({})]);
    await Player.insertMany(players);
    await Team.insertMany(teams);
    await Auction.create({});
    console.log('NPL auction data seeded');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seed();
