import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getWebsiteSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await dbService.getWebsiteSettings();
    sendSuccess(res, settings, 'Settings retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get settings', 500);
  }
};

export const updateWebsiteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value, description } = req.body;
    const updated = await dbService.updateWebsiteSetting(key, value, description);
    sendSuccess(res, updated, 'Setting saved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update setting', 500);
  }
};

export const getStatistics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dbService.getStatistics();
    sendSuccess(res, stats, 'Statistics retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get statistics', 500);
  }
};

export const createStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createStatistic(req.body);
    sendSuccess(res, created, 'Statistic created', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create statistic', 500);
  }
};

export const updateStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateStatistic(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Statistic not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Statistic updated');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update statistic', 500);
  }
};

export const deleteStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteStatistic(req.params.id);
    if (!deleted) {
      sendError(res, 'Statistic not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Statistic deleted');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete statistic', 500);
  }
};

export const getDashboardOverview = async (_req: Request, res: Response): Promise<void> => {
  try {
    const overview = await dbService.getDashboardOverview();
    sendSuccess(res, overview, 'Dashboard metrics retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve dashboard overview', 500);
  }
};
