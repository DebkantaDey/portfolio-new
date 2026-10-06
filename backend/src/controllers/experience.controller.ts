import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, featured } = req.query;
    const experiences = await dbService.getExperiences({
      search: search as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
    sendSuccess(res, experiences, 'Experiences retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get experiences', 500);
  }
};

export const getExperienceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exp = await dbService.getExperienceById(req.params.id);
    if (!exp) {
      sendError(res, 'Experience not found', 404);
      return;
    }
    sendSuccess(res, exp, 'Experience retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get experience', 500);
  }
};

export const createExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createExperience(req.body);
    sendSuccess(res, created, 'Experience created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create experience', 500);
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateExperience(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Experience not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Experience updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update experience', 500);
  }
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteExperience(req.params.id);
    if (!deleted) {
      sendError(res, 'Experience not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Experience deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete experience', 500);
  }
};
