export const requireAuctioneer = (req, res, next) => {
  if (req.body.role !== 'auctioneer') {
    res.status(403);
    throw new Error('Only auctioneer can perform this action');
  }

  next();
};
