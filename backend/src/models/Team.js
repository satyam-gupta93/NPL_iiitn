import mongoose from 'mongoose';

const boughtPlayerSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    purse: {
      type: Number,
      required: true,
      min: 0
    },
    players: [boughtPlayerSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
