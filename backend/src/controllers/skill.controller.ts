import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, isActive, search } = req.query;
    const skills = await dbService.getSkills({
      category: category as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      search: search as string,
    });
    sendSuccess(res, skills, 'Skills retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to retrieve skills', 500);
  }
};

export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await dbService.getSkillById(req.params.id);
    if (!skill) {
      sendError(res, 'Skill not found', 404);
      return;
    }
    sendSuccess(res, skill, 'Skill retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get skill', 500);
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createSkill(req.body);
    sendSuccess(res, created, 'Skill created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create skill', 500);
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateSkill(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Skill not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Skill updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update skill', 500);
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteSkill(req.params.id);
    if (!deleted) {
      sendError(res, 'Skill not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Skill deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete skill', 500);
  }
};

export const reorderSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderedIds } = req.body;
    const reordered = await dbService.reorderSkills(orderedIds);
    sendSuccess(res, reordered, 'Skills reordered successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to reorder skills', 500);
  }
};
