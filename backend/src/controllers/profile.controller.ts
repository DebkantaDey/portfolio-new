import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getProfile = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await dbService.getProfile();
    sendSuccess(res, profile, 'Profile fetched successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch profile', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateProfile(req.body);
    sendSuccess(res, updated, 'Profile updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update profile', 500);
  }
};
