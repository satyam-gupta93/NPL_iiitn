import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    skill: {
      type: String,
      enum: ['Batsman', 'Bowler', 'All-Rounder'],
      required: true
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    isSold: {
      type: Boolean,
      default: false
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    soldPrice: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Player', playerSchema);
