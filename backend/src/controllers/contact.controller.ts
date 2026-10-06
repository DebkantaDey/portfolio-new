import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message, honeypot } = req.body;

    // Honeypot anti-spam check: If the hidden honeypot field is filled, silently discard spam
    if (honeypot && honeypot.trim().length > 0) {
      logger.warn(`Spam bot caught via honeypot field from IP ${req.ip}`);
      sendSuccess(res, null, 'Thank you! Your message has been received.');
      return;
    }

    const created = await dbService.createContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    sendSuccess(res, { id: created.id }, 'Your message has been sent successfully! I will reply shortly.', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to submit contact message', 500);
  }
};

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isRead, isArchived, search } = req.query;
    const messages = await dbService.getContactMessages({
      isRead: isRead !== undefined ? isRead === 'true' : undefined,
      isArchived: isArchived !== undefined ? isArchived === 'true' : undefined,
      search: search as string,
    });
    sendSuccess(res, messages, 'Contact messages retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get contact messages', 500);
  }
};

export const getContactMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const msg = await dbService.getContactMessageById(req.params.id);
    if (!msg) {
      sendError(res, 'Message not found', 404);
      return;
    }
    sendSuccess(res, msg, 'Message retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get message', 500);
  }
};

export const updateContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateContactMessage(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Message not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Message status updated');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update message', 500);
  }
};

export const deleteContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteContactMessage(req.params.id);
    if (!deleted) {
      sendError(res, 'Message not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Message deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete message', 500);
  }
};
