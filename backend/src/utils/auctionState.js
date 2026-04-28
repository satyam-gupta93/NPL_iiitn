import Auction from '../models/Auction.js';

export const BID_INCREMENT = 50000;

export const getAuctionState = async () => {
  let auction = await Auction.findOne()
    .populate('currentPlayer')
    .populate('highestBidder')
    .populate('history.player')
    .populate('history.team');

  if (!auction) {
    auction = await Auction.create({});
    auction = await Auction.findById(auction._id)
      .populate('currentPlayer')
      .populate('highestBidder')
      .populate('history.player')
      .populate('history.team');
  }

  return auction;
};
