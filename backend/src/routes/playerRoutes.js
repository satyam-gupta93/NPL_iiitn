import express from 'express';
import { getAvailablePlayers, getPlayers } from '../controllers/playerController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getPlayers));
router.get('/available', asyncHandler(getAvailablePlayers));

export default router;
