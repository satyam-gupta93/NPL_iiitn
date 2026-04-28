import express from 'express';
import { getTeamById, getTeams } from '../controllers/teamController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getTeams));
router.get('/:id', asyncHandler(getTeamById));

export default router;
