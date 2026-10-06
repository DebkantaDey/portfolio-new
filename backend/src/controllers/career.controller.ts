import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getCareerOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { remoteType, status, featured, search } = req.query;
    const opportunities = await dbService.getCareerOpportunities({
      remoteType: remoteType as string,
      status: status as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      search: search as string,
    });
    sendSuccess(res, opportunities, 'Career opportunities retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get career opportunities', 500);
  }
};

export const getCareerOpportunityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunity = await dbService.getCareerOpportunityById(req.params.id);
    if (!opportunity) {
      sendError(res, 'Career opportunity not found', 404);
      return;
    }
    sendSuccess(res, opportunity, 'Career opportunity retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get career opportunity', 500);
  }
};

export const createCareerOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createCareerOpportunity(req.body);
    sendSuccess(res, created, 'Career opportunity created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create career opportunity', 500);
  }
};

export const updateCareerOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateCareerOpportunity(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Career opportunity not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Career opportunity updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update career opportunity', 500);
  }
};

export const deleteCareerOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteCareerOpportunity(req.params.id);
    if (!deleted) {
      sendError(res, 'Career opportunity not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Career opportunity deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete career opportunity', 500);
  }
};
