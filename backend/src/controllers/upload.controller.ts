import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const uploadFile = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      sendError(res, 'No file uploaded', 400);
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    sendSuccess(
      res,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      'File uploaded successfully',
      201
    );
  } catch (error: any) {
    sendError(res, error.message || 'File upload failed', 500);
  }
};

export const listUploadedFiles = (_req: Request, res: Response): void => {
  try {
    const uploadDir = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
    if (!fs.existsSync(uploadDir)) {
      sendSuccess(res, [], 'No uploads directory found');
      return;
    }

    const files = fs.readdirSync(uploadDir).map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stat = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stat.size,
        createdAt: stat.birthtime,
      };
    });

    sendSuccess(res, files, 'Uploaded files retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to list uploaded files', 500);
  }
};
