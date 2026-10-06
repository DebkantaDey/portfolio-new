import { Request, Response } from 'express';
import { dbService } from '../services/db.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, projectType, status, search, featured, published } = req.query;
    const projects = await dbService.getProjects({
      category: category as string,
      projectType: projectType as string,
      status: status as string,
      search: search as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      published: published !== undefined ? published === 'true' : undefined,
    });
    sendSuccess(res, projects, 'Projects retrieved successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get projects', 500);
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await dbService.getProjectBySlug(req.params.slug);
    if (!project) {
      sendError(res, `Project with slug '${req.params.slug}' not found`, 404);
      return;
    }
    sendSuccess(res, project, 'Project retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get project by slug', 500);
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await dbService.getProjectById(req.params.id);
    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }
    sendSuccess(res, project, 'Project retrieved');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to get project', 500);
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await dbService.createProject(req.body);
    sendSuccess(res, created, 'Project created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create project', 500);
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await dbService.updateProject(req.params.id, req.body);
    if (!updated) {
      sendError(res, 'Project not found', 404);
      return;
    }
    sendSuccess(res, updated, 'Project updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update project', 500);
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await dbService.deleteProject(req.params.id);
    if (!deleted) {
      sendError(res, 'Project not found', 404);
      return;
    }
    sendSuccess(res, deleted, 'Project deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete project', 500);
  }
};
