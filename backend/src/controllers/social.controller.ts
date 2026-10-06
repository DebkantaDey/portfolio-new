import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getSocialLinks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const links = await dbService.getSocialLinks();
    sendSuccess(res, links, 'Social links retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get social links', 500);
  }
};

export const getSocialLinkById = async (req: Request, res: Response): Promise<void> => {
  try {
    const link = await dbService.getSocialLinkById(req.params.id);
    if (!link) {
      sendError(res, 'Social link not found', 404);
      return;
    }
    sendSuccess(res, link, 'Social link retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get social link', 500);
  }
};

export const createSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createSocialLink(req.body);
    sendSuccess(res, created, 'Social link created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create social link', 500);
  }
};

export const updateSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateSocialLink(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Social link not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Social link updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update social link', 500);
  }
};

export const deleteSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteSocialLink(req.params.id);
    if (!deleted) {
      sendError(res, 'Social link not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Social link deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete social link', 500);
  }
};
