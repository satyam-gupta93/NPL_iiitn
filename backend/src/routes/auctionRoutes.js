import express from 'express';
import {
  acceptBid,
  getAuction,
  placeBid,
  rejectBid,
  startAuction
} from '../controllers/auctionController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuctioneer } from '../middleware/role.js';

const router = express.Router();

router.get('/', asyncHandler(getAuction));
router.post('/start', requireAuctioneer, asyncHandler(startAuction));
router.post('/bid', asyncHandler(placeBid));
router.post('/accept', requireAuctioneer, asyncHandler(acceptBid));
router.post('/reject', requireAuctioneer, asyncHandler(rejectBid));

export default router;
