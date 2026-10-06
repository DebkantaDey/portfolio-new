import { authStorage } from './auth';
import {
  Profile,
  Skill,
  Experience,
  Education,
  Project,
  Service,
  CareerOpportunity,
  Certification,
  Achievement,
  Testimonial,
  SocialLink,
  ContactMessage,
  WebsiteSetting,
  Statistic,
  DashboardOverview,
  ApiResponse,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = authStorage.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.errors = json.errors;
    err.status = response.status;
    throw err;
  }

  return json.data;
}

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    return fetchApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  getMe: async () => fetchApi<any>('/auth/me'),
  logout: async () => fetchApi<any>('/auth/logout', { method: 'POST' }),

  // Profile
  getProfile: async () => fetchApi<Profile>('/profile'),
  updateProfile: async (data: Partial<Profile>) =>
    fetchApi<Profile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Skills
  getSkills: async (params?: { category?: string; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<Skill[]>(`/skills?${query.toString()}`);
  },
  createSkill: async (data: Partial<Skill>) =>
    fetchApi<Skill>('/skills', { method: 'POST', body: JSON.stringify(data) }),
  updateSkill: async (id: string, data: Partial<Skill>) =>
    fetchApi<Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSkill: async (id: string) =>
    fetchApi<any>(`/skills/${id}`, { method: 'DELETE' }),
  reorderSkills: async (orderedIds: string[]) =>
    fetchApi<Skill[]>('/skills/reorder', { method: 'PUT', body: JSON.stringify({ orderedIds }) }),

  // Experiences
  getExperiences: async (params?: { featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<Experience[]>(`/experiences?${query.toString()}`);
  },
  createExperience: async (data: Partial<Experience>) =>
    fetchApi<Experience>('/experiences', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: async (id: string, data: Partial<Experience>) =>
    fetchApi<Experience>(`/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: async (id: string) =>
    fetchApi<any>(`/experiences/${id}`, { method: 'DELETE' }),

  // Education
  getEducations: async () => fetchApi<Education[]>('/educations'),
  createEducation: async (data: Partial<Education>) =>
    fetchApi<Education>('/educations', { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: async (id: string, data: Partial<Education>) =>
    fetchApi<Education>(`/educations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: async (id: string) =>
    fetchApi<any>(`/educations/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: async (params?: { category?: string; featured?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.search) query.append('search', params.search);
    return fetchApi<Project[]>(`/projects?${query.toString()}`);
  },
  getProjectBySlug: async (slug: string) => fetchApi<Project>(`/projects/slug/${slug}`),
  createProject: async (data: Partial<Project>) =>
    fetchApi<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: async (id: string, data: Partial<Project>) =>
    fetchApi<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: async (id: string) =>
    fetchApi<any>(`/projects/${id}`, { method: 'DELETE' }),

  // Services
  getServices: async (params?: { featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<Service[]>(`/services?${query.toString()}`);
  },
  getServiceBySlug: async (slug: string) => fetchApi<Service>(`/services/slug/${slug}`),
  createService: async (data: Partial<Service>) =>
    fetchApi<Service>('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: async (id: string, data: Partial<Service>) =>
    fetchApi<Service>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: async (id: string) =>
    fetchApi<any>(`/services/${id}`, { method: 'DELETE' }),

  // Career Opportunities
  getCareerOpportunities: async (params?: { remoteType?: string; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.remoteType) query.append('remoteType', params.remoteType);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<CareerOpportunity[]>(`/career?${query.toString()}`);
  },
  createCareerOpportunity: async (data: Partial<CareerOpportunity>) =>
    fetchApi<CareerOpportunity>('/career', { method: 'POST', body: JSON.stringify(data) }),
  updateCareerOpportunity: async (id: string, data: Partial<CareerOpportunity>) =>
    fetchApi<CareerOpportunity>(`/career/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareerOpportunity: async (id: string) =>
    fetchApi<any>(`/career/${id}`, { method: 'DELETE' }),

  // Certifications
  getCertifications: async () => fetchApi<Certification[]>('/certifications'),
  createCertification: async (data: Partial<Certification>) =>
    fetchApi<Certification>('/certifications', { method: 'POST', body: JSON.stringify(data) }),
  updateCertification: async (id: string, data: Partial<Certification>) =>
    fetchApi<Certification>(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertification: async (id: string) =>
    fetchApi<any>(`/certifications/${id}`, { method: 'DELETE' }),

  // Achievements
  getAchievements: async (params?: { featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<Achievement[]>(`/achievements?${query.toString()}`);
  },
  createAchievement: async (data: Partial<Achievement>) =>
    fetchApi<Achievement>('/achievements', { method: 'POST', body: JSON.stringify(data) }),
  updateAchievement: async (id: string, data: Partial<Achievement>) =>
    fetchApi<Achievement>(`/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAchievement: async (id: string) =>
    fetchApi<any>(`/achievements/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: async (params?: { featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    return fetchApi<Testimonial[]>(`/testimonials?${query.toString()}`);
  },
  createTestimonial: async (data: Partial<Testimonial>) =>
    fetchApi<Testimonial>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: async (id: string, data: Partial<Testimonial>) =>
    fetchApi<Testimonial>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: async (id: string) =>
    fetchApi<any>(`/testimonials/${id}`, { method: 'DELETE' }),

  // Social Links
  getSocialLinks: async () => fetchApi<SocialLink[]>('/social-links'),
  createSocialLink: async (data: Partial<SocialLink>) =>
    fetchApi<SocialLink>('/social-links', { method: 'POST', body: JSON.stringify(data) }),
  updateSocialLink: async (id: string, data: Partial<SocialLink>) =>
    fetchApi<SocialLink>(`/social-links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSocialLink: async (id: string) =>
    fetchApi<any>(`/social-links/${id}`, { method: 'DELETE' }),

  // Contact
  submitContact: async (data: { name: string; email: string; phone?: string; subject: string; message: string; honeypot?: string }) =>
    fetchApi<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getContactMessages: async (params?: { isRead?: boolean; isArchived?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.isRead !== undefined) query.append('isRead', String(params.isRead));
    if (params?.isArchived !== undefined) query.append('isArchived', String(params.isArchived));
    if (params?.search) query.append('search', params.search);
    return fetchApi<ContactMessage[]>(`/contact?${query.toString()}`);
  },
  updateContactMessage: async (id: string, data: { isRead?: boolean; isArchived?: boolean }) =>
    fetchApi<ContactMessage>(`/contact/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteContactMessage: async (id: string) =>
    fetchApi<any>(`/contact/${id}`, { method: 'DELETE' }),

  // Settings & Statistics
  getSettings: async () => fetchApi<WebsiteSetting[]>('/settings'),
  updateSetting: async (key: string, value: string, description?: string) =>
    fetchApi<WebsiteSetting>('/settings', { method: 'PUT', body: JSON.stringify({ key, value, description }) }),
  getStatistics: async () => fetchApi<Statistic[]>('/statistics'),
  createStatistic: async (data: Partial<Statistic>) =>
    fetchApi<Statistic>('/statistics', { method: 'POST', body: JSON.stringify(data) }),
  updateStatistic: async (id: string, data: Partial<Statistic>) =>
    fetchApi<Statistic>(`/statistics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStatistic: async (id: string) =>
    fetchApi<any>(`/statistics/${id}`, { method: 'DELETE' }),

  // Dashboard Overview
  getDashboardOverview: async () => fetchApi<DashboardOverview>('/dashboard/overview'),

  // Upload
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = authStorage.getToken();

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'File upload failed');
    }
    return json.data;
  },
};
