import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getCertifications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const certs = await dbService.getCertifications();
    sendSuccess(res, certs, 'Certifications retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get certifications', 500);
  }
};

export const getCertificationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cert = await dbService.getCertificationById(req.params.id);
    if (!cert) {
      sendError(res, 'Certification not found', 404);
      return;
    }
    sendSuccess(res, cert, 'Certification retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get certification', 500);
  }
};

export const createCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createCertification(req.body);
    sendSuccess(res, created, 'Certification created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create certification', 500);
  }
};

export const updateCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateCertification(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Certification not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Certification updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update certification', 500);
  }
};

export const deleteCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteCertification(req.params.id);
    if (!deleted) {
      sendError(res, 'Certification not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Certification deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete certification', 500);
  }
};
