import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { dbService } from '../services/db.service';
import { verifyPassword, hashPassword } from '../utils/password';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await dbService.findUserByEmail(email);

    if (!user) {
      sendError(res, 'Invalid email or password credentials', 401);
      return;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      sendError(res, 'Invalid email or password credentials', 401);
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await dbService.updateUserLastLogin(user.id);

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      'Authentication successful'
    );
  } catch (error: any) {
    sendError(res, error.message || 'Login failed', 500);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt,
      },
      'User profile fetched'
    );
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch user', 500);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  sendSuccess(res, null, 'Logged out successfully');
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }
    const { currentPassword, newPassword } = req.body;
    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      sendError(res, 'Current password is incorrect', 400);
      return;
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    sendSuccess(res, null, 'Password updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update password', 500);
  }
};
