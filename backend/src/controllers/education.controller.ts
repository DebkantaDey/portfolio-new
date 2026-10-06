import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getEducations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const educations = await dbService.getEducations();
    sendSuccess(res, educations, 'Educations retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get educations', 500);
  }
};

export const getEducationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const edu = await dbService.getEducationById(req.params.id);
    if (!edu) {
      sendError(res, 'Education not found', 404);
      return;
    }
    sendSuccess(res, edu, 'Education retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get education', 500);
  }
};

export const createEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createEducation(req.body);
    sendSuccess(res, created, 'Education created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create education', 500);
  }
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateEducation(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Education not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Education updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update education', 500);
  }
};

export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteEducation(req.params.id);
    if (!deleted) {
      sendError(res, 'Education not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Education deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete education', 500);
  }
};
