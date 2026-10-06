import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured, isActive } = req.query;
    const services = await dbService.getServices({
      featured: featured !== undefined ? featured === 'true' : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
    sendSuccess(res, services, 'Services retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get services', 500);
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await dbService.getServiceBySlug(req.params.slug);
    if (!service) {
      sendError(res, `Service '${req.params.slug}' not found`, 404);
      return;
    }
    sendSuccess(res, service, 'Service retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get service by slug', 500);
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await dbService.getServiceById(req.params.id);
    if (!service) {
      sendError(res, 'Service not found', 404);
      return;
    }
    sendSuccess(res, service, 'Service retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get service', 500);
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createService(req.body);
    sendSuccess(res, created, 'Service created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create service', 500);
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateService(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Service not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Service updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update service', 500);
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteService(req.params.id);
    if (!deleted) {
      sendError(res, 'Service not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Service deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete service', 500);
  }
};
