import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured } = req.query;
    const testimonials = await dbService.getTestimonials({
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
    sendSuccess(res, testimonials, 'Testimonials retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get testimonials', 500);
  }
};

export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await dbService.getTestimonialById(req.params.id);
    if (!testimonial) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    sendSuccess(res, testimonial, 'Testimonial retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get testimonial', 500);
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createTestimonial(req.body);
    sendSuccess(res, created, 'Testimonial created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create testimonial', 500);
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateTestimonial(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Testimonial updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update testimonial', 500);
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteTestimonial(req.params.id);
    if (!deleted) {
      sendError(res, 'Testimonial not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Testimonial deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete testimonial', 500);
  }
};
