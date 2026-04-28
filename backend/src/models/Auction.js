import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    amount: { type: Number, min: 0 },
    action: {
      type: String,
      enum: ['STARTED', 'BID', 'ACCEPTED', 'REJECTED'],
      required: true
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const auctionSchema = new mongoose.Schema(
  {
    currentPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null
    },
    currentBid: {
      type: Number,
      default: 0,
      min: 0
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    status: {
      type: String,
      enum: ['IDLE', 'LIVE', 'SOLD', 'REJECTED'],
      default: 'IDLE'
    },
    lastBidTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    history: [historySchema]
  },
  { timestamps: true }
);

export default mongoose.model('Auction', auctionSchema);
