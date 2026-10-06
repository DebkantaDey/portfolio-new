import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured } = req.query;
    const achievements = await dbService.getAchievements({
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
    sendSuccess(res, achievements, 'Achievements retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get achievements', 500);
  }
};

export const getAchievementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievement = await dbService.getAchievementById(req.params.id);
    if (!achievement) {
      sendError(res, 'Achievement not found', 404);
      return;
    }
    sendSuccess(res, achievement, 'Achievement retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get achievement', 500);
  }
};

export const createAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createAchievement(req.body);
    sendSuccess(res, created, 'Achievement created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create achievement', 500);
  }
};

export const updateAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateAchievement(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Achievement not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Achievement updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update achievement', 500);
  }
};

export const deleteAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteAchievement(req.params.id);
    if (!deleted) {
      sendError(res, 'Achievement not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Achievement deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete achievement', 500);
  }
};
