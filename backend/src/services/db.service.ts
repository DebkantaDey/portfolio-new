import { prisma, testDbConnection } from '../config/prisma';
import { getInitialData } from '../utils/initialData';
import { logger } from '../utils/logger';

class DatabaseService {
  private isPostgresAvailable: boolean | null = null;
  private memoryStore: any = null;

  async init() {
    this.isPostgresAvailable = await testDbConnection();
    if (!this.isPostgresAvailable) {
      logger.info('Using in-memory data store loaded with realistic seed data.');
      const data = await getInitialData();
      this.memoryStore = {
        users: [data.adminUser],
        profile: data.profile,
        statistics: [...data.statistics],
        skills: [...data.skills],
        experiences: [...data.experiences],
        educations: [...data.educations],
        projects: [...data.projects],
        services: [...data.services],
        careerOpportunities: [...data.careerOpportunities],
        certifications: [...data.certifications],
        achievements: [...data.achievements],
        testimonials: [...data.testimonials],
        socialLinks: [...data.socialLinks],
        websiteSettings: [...data.websiteSettings],
        contactMessages: [] as any[],
      };
    } else {
      logger.info('Using PostgreSQL through Prisma ORM.');
    }
  }

  get usingPostgres(): boolean {
    return !!this.isPostgresAvailable;
  }

  // --- USERS ---
  async findUserByEmail(email: string) {
    if (this.usingPostgres) {
      return await prisma.user.findUnique({ where: { email } });
    }
    return this.memoryStore.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id: string) {
    if (this.usingPostgres) {
      return await prisma.user.findUnique({ where: { id } });
    }
    return this.memoryStore.users.find((u: any) => u.id === id) || null;
  }

  async updateUserLastLogin(id: string) {
    const now = new Date();
    if (this.usingPostgres) {
      return await prisma.user.update({ where: { id }, data: { lastLoginAt: now } });
    }
    const user = this.memoryStore.users.find((u: any) => u.id === id);
    if (user) user.lastLoginAt = now;
    return user;
  }

  // --- PROFILE ---
  async getProfile() {
    if (this.usingPostgres) {
      return await prisma.profile.findFirst();
    }
    return this.memoryStore.profile;
  }

  async updateProfile(data: any) {
    if (this.usingPostgres) {
      const existing = await prisma.profile.findFirst();
      if (existing) {
        return await prisma.profile.update({ where: { id: existing.id }, data });
      }
      return await prisma.profile.create({ data });
    }
    this.memoryStore.profile = { ...this.memoryStore.profile, ...data, updatedAt: new Date() };
    return this.memoryStore.profile;
  }

  // --- SKILLS ---
  async getSkills(query?: { category?: string; featured?: boolean; isActive?: boolean; search?: string }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.category) where.category = query.category;
      if (query?.featured !== undefined) where.featured = query.featured;
      if (query?.isActive !== undefined) where.isActive = query.isActive;
      if (query?.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      return await prisma.skill.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.skills];
    if (query?.category) list = list.filter((s) => s.category.toLowerCase() === query.category?.toLowerCase());
    if (query?.featured !== undefined) list = list.filter((s) => s.featured === query.featured);
    if (query?.isActive !== undefined) list = list.filter((s) => s.isActive === query.isActive);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getSkillById(id: string) {
    if (this.usingPostgres) return await prisma.skill.findUnique({ where: { id } });
    return this.memoryStore.skills.find((s: any) => s.id === id) || null;
  }

  async createSkill(data: any) {
    const payload = { ...data, id: data.id || `sk_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.skill.create({ data: payload });
    this.memoryStore.skills.push(payload);
    return payload;
  }

  async updateSkill(id: string, data: any) {
    if (this.usingPostgres) return await prisma.skill.update({ where: { id }, data });
    const idx = this.memoryStore.skills.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    this.memoryStore.skills[idx] = { ...this.memoryStore.skills[idx], ...data, updatedAt: new Date() };
    return this.memoryStore.skills[idx];
  }

  async deleteSkill(id: string) {
    if (this.usingPostgres) return await prisma.skill.delete({ where: { id } });
    const idx = this.memoryStore.skills.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    return this.memoryStore.skills.splice(idx, 1)[0];
  }

  async reorderSkills(orderedIds: string[]) {
    if (this.usingPostgres) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.skill.update({ where: { id }, data: { displayOrder: index + 1 } })
        )
      );
      return await prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } });
    }
    orderedIds.forEach((id, index) => {
      const skill = this.memoryStore.skills.find((s: any) => s.id === id);
      if (skill) skill.displayOrder = index + 1;
    });
    this.memoryStore.skills.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return [...this.memoryStore.skills];
  }

  // --- EXPERIENCES ---
  async getExperiences(query?: { search?: string; featured?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.featured !== undefined) where.isFeatured = query.featured;
      if (query?.search) {
        where.OR = [
          { companyName: { contains: query.search, mode: 'insensitive' } },
          { jobTitle: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      return await prisma.experience.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.experiences];
    if (query?.featured !== undefined) list = list.filter((e) => e.isFeatured === query.featured);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((e) => e.companyName.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getExperienceById(id: string) {
    if (this.usingPostgres) return await prisma.experience.findUnique({ where: { id } });
    return this.memoryStore.experiences.find((e: any) => e.id === id) || null;
  }

  async createExperience(data: any) {
    const payload = {
      ...data,
      id: data.id || `exp_${Date.now()}`,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.experience.create({ data: payload });
    this.memoryStore.experiences.push(payload);
    return payload;
  }

  async updateExperience(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.startDate) payload.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) payload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (this.usingPostgres) return await prisma.experience.update({ where: { id }, data: payload });
    const idx = this.memoryStore.experiences.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    this.memoryStore.experiences[idx] = { ...this.memoryStore.experiences[idx], ...payload };
    return this.memoryStore.experiences[idx];
  }

  async deleteExperience(id: string) {
    if (this.usingPostgres) return await prisma.experience.delete({ where: { id } });
    const idx = this.memoryStore.experiences.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    return this.memoryStore.experiences.splice(idx, 1)[0];
  }

  // --- EDUCATIONS ---
  async getEducations() {
    if (this.usingPostgres) return await prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
    return [...this.memoryStore.educations].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getEducationById(id: string) {
    if (this.usingPostgres) return await prisma.education.findUnique({ where: { id } });
    return this.memoryStore.educations.find((e: any) => e.id === id) || null;
  }

  async createEducation(data: any) {
    const payload = {
      ...data,
      id: data.id || `edu_${Date.now()}`,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.education.create({ data: payload });
    this.memoryStore.educations.push(payload);
    return payload;
  }

  async updateEducation(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.startDate) payload.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) payload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (this.usingPostgres) return await prisma.education.update({ where: { id }, data: payload });
    const idx = this.memoryStore.educations.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    this.memoryStore.educations[idx] = { ...this.memoryStore.educations[idx], ...payload };
    return this.memoryStore.educations[idx];
  }

  async deleteEducation(id: string) {
    if (this.usingPostgres) return await prisma.education.delete({ where: { id } });
    const idx = this.memoryStore.educations.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    return this.memoryStore.educations.splice(idx, 1)[0];
  }

  // --- PROJECTS ---
  async getProjects(query?: { category?: string; projectType?: string; status?: string; search?: string; featured?: boolean; published?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.category) where.category = query.category;
      if (query?.projectType) where.projectType = query.projectType;
      if (query?.status) where.status = query.status;
      if (query?.featured !== undefined) where.featured = query.featured;
      if (query?.published !== undefined) where.published = query.published;
      if (query?.search) {
        where.OR = [
          { title: { contains: query.search, mode: 'insensitive' } },
          { shortDescription: { contains: query.search, mode: 'insensitive' } },
          { fullDescription: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      return await prisma.project.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.projects];
    if (query?.category) list = list.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
    if (query?.projectType) list = list.filter((p) => p.projectType.toLowerCase() === query.projectType?.toLowerCase());
    if (query?.status) list = list.filter((p) => p.status.toLowerCase() === query.status?.toLowerCase());
    if (query?.featured !== undefined) list = list.filter((p) => p.featured === query.featured);
    if (query?.published !== undefined) list = list.filter((p) => p.published === query.published);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getProjectBySlug(slug: string) {
    if (this.usingPostgres) return await prisma.project.findUnique({ where: { slug } });
    return this.memoryStore.projects.find((p: any) => p.slug === slug) || null;
  }

  async getProjectById(id: string) {
    if (this.usingPostgres) return await prisma.project.findUnique({ where: { id } });
    return this.memoryStore.projects.find((p: any) => p.id === id) || null;
  }

  async createProject(data: any) {
    const payload = {
      ...data,
      id: data.id || `proj_${Date.now()}`,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      galleryImages: data.galleryImages || [],
      technologies: data.technologies || [],
      keyFeatures: data.keyFeatures || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.project.create({ data: payload });
    this.memoryStore.projects.push(payload);
    return payload;
  }

  async updateProject(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.startDate !== undefined) payload.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) payload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (this.usingPostgres) return await prisma.project.update({ where: { id }, data: payload });
    const idx = this.memoryStore.projects.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    this.memoryStore.projects[idx] = { ...this.memoryStore.projects[idx], ...payload };
    return this.memoryStore.projects[idx];
  }

  async deleteProject(id: string) {
    if (this.usingPostgres) return await prisma.project.delete({ where: { id } });
    const idx = this.memoryStore.projects.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    return this.memoryStore.projects.splice(idx, 1)[0];
  }

  // --- SERVICES ---
  async getServices(query?: { featured?: boolean; isActive?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.featured !== undefined) where.featured = query.featured;
      if (query?.isActive !== undefined) where.isActive = query.isActive;
      return await prisma.service.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.services];
    if (query?.featured !== undefined) list = list.filter((s) => s.featured === query.featured);
    if (query?.isActive !== undefined) list = list.filter((s) => s.isActive === query.isActive);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getServiceBySlug(slug: string) {
    if (this.usingPostgres) return await prisma.service.findUnique({ where: { slug } });
    return this.memoryStore.services.find((s: any) => s.slug === slug) || null;
  }

  async getServiceById(id: string) {
    if (this.usingPostgres) return await prisma.service.findUnique({ where: { id } });
    return this.memoryStore.services.find((s: any) => s.id === id) || null;
  }

  async createService(data: any) {
    const payload = {
      ...data,
      id: data.id || `srv_${Date.now()}`,
      features: data.features || [],
      technologies: data.technologies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.service.create({ data: payload });
    this.memoryStore.services.push(payload);
    return payload;
  }

  async updateService(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.service.update({ where: { id }, data: payload });
    const idx = this.memoryStore.services.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    this.memoryStore.services[idx] = { ...this.memoryStore.services[idx], ...payload };
    return this.memoryStore.services[idx];
  }

  async deleteService(id: string) {
    if (this.usingPostgres) return await prisma.service.delete({ where: { id } });
    const idx = this.memoryStore.services.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    return this.memoryStore.services.splice(idx, 1)[0];
  }

  // --- CAREER OPPORTUNITIES ---
  async getCareerOpportunities(query?: { search?: string; remoteType?: string; status?: string; featured?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.remoteType) where.remoteType = query.remoteType;
      if (query?.status) where.status = query.status;
      if (query?.featured !== undefined) where.featured = query.featured;
      if (query?.search) {
        where.OR = [
          { companyName: { contains: query.search, mode: 'insensitive' } },
          { jobTitle: { contains: query.search, mode: 'insensitive' } },
          { location: { contains: query.search, mode: 'insensitive' } },
          { jobUrl: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      const results = await prisma.careerOpportunity.findMany({ where, orderBy: { displayOrder: 'asc' } });
      return results.map((item) => ({
        ...item,
        careerUrl: (item as any).careerUrl || item.jobUrl || item.applicationUrl || null,
      }));
    }
    let list = [...this.memoryStore.careerOpportunities];
    if (query?.remoteType) list = list.filter((c) => c.remoteType?.toLowerCase() === query.remoteType?.toLowerCase());
    if (query?.status) list = list.filter((c) => c.status?.toLowerCase() === query.status?.toLowerCase());
    if (query?.featured !== undefined) list = list.filter((c) => c.featured === query.featured);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.companyName?.toLowerCase().includes(q) ||
          c.jobTitle?.toLowerCase().includes(q) ||
          c.jobUrl?.toLowerCase().includes(q) ||
          c.careerUrl?.toLowerCase().includes(q) ||
          (c.requiredSkills && c.requiredSkills.some((s: string) => s.toLowerCase().includes(q)))
      );
    }
    return list
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((item) => ({
        ...item,
        careerUrl: item.careerUrl || item.jobUrl || item.applicationUrl || null,
      }));
  }

  async getCareerOpportunityById(id: string) {
    if (this.usingPostgres) {
      const item = await prisma.careerOpportunity.findUnique({ where: { id } });
      if (!item) return null;
      return {
        ...item,
        careerUrl: (item as any).careerUrl || item.jobUrl || item.applicationUrl || null,
      };
    }
    const item = this.memoryStore.careerOpportunities.find((c: any) => c.id === id);
    if (!item) return null;
    return {
      ...item,
      careerUrl: item.careerUrl || item.jobUrl || item.applicationUrl || null,
    };
  }

  private resolveCompanyLogo(companyName: string, careerUrl?: string | null): string {
    let domain = '';
    if (careerUrl) {
      try {
        const formatted = careerUrl.startsWith('http') ? careerUrl : `https://${careerUrl}`;
        const parsed = new URL(formatted);
        domain = parsed.hostname.replace(/^www\./i, '');
        if (
          domain.includes('lever.co') ||
          domain.includes('greenhouse.io') ||
          domain.includes('ashbyhq.com') ||
          domain.includes('myworkdayjobs.com') ||
          domain.includes('workday.com')
        ) {
          if (companyName) {
            domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          }
        }
      } catch {
        // fallback
      }
    }
    if (!domain && companyName) {
      domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    }
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return '';
  }

  async createCareerOpportunity(data: any) {
    const careerLink = data.careerUrl || data.careerPageUrl || data.jobUrl || null;
    const companyName = data.companyName || 'Company';
    const companyLogo = data.companyLogo || this.resolveCompanyLogo(companyName, careerLink);

    const payload: any = {
      ...data,
      id: data.id || `car_${Date.now()}`,
      companyName,
      companyLogo,
      jobTitle: data.jobTitle || 'Career Opportunities',
      location: data.location || 'Remote / Global',
      jobDescription: data.jobDescription || `Official career openings and job listings at ${companyName}.`,
      jobUrl: careerLink,
      applicationUrl: data.applicationUrl || careerLink || '',
      companyWebsite: data.companyWebsite || null,
      requiredSkills: data.requiredSkills || [],
      postedDate: data.postedDate ? new Date(data.postedDate) : new Date(),
      closingDate: data.closingDate ? new Date(data.closingDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // If not using postgres, also retain careerUrl on memory store object
    if (careerLink) payload.careerUrl = careerLink;

    if (this.usingPostgres) {
      // Prisma table uses jobUrl, so omit extra non-schema properties if necessary
      const { careerPageUrl, careerUrl, ...prismaData } = payload;
      const created = await prisma.careerOpportunity.create({ data: prismaData });
      return {
        ...created,
        careerUrl: created.jobUrl || created.applicationUrl || null,
      };
    }
    this.memoryStore.careerOpportunities.push(payload);
    return payload;
  }

  async updateCareerOpportunity(id: string, data: any) {
    const careerLink = data.careerUrl || data.careerPageUrl || data.jobUrl;
    const payload: any = { ...data, updatedAt: new Date() };
    if (careerLink !== undefined) {
      payload.jobUrl = careerLink || null;
      if (!payload.applicationUrl && careerLink) {
        payload.applicationUrl = careerLink;
      }
      payload.careerUrl = careerLink;
    }
    if (!payload.companyLogo && (payload.companyName || careerLink)) {
      payload.companyLogo = this.resolveCompanyLogo(payload.companyName || '', careerLink);
    }
    if (data.postedDate) payload.postedDate = new Date(data.postedDate);
    if (data.closingDate !== undefined) payload.closingDate = data.closingDate ? new Date(data.closingDate) : null;

    if (this.usingPostgres) {
      const { careerPageUrl, careerUrl, ...prismaData } = payload;
      const updated = await prisma.careerOpportunity.update({ where: { id }, data: prismaData });
      return {
        ...updated,
        careerUrl: updated.jobUrl || updated.applicationUrl || null,
      };
    }
    const idx = this.memoryStore.careerOpportunities.findIndex((c: any) => c.id === id);
    if (idx === -1) return null;
    this.memoryStore.careerOpportunities[idx] = { ...this.memoryStore.careerOpportunities[idx], ...payload };
    return this.memoryStore.careerOpportunities[idx];
  }

  async deleteCareerOpportunity(id: string) {
    if (this.usingPostgres) return await prisma.careerOpportunity.delete({ where: { id } });
    const idx = this.memoryStore.careerOpportunities.findIndex((c: any) => c.id === id);
    if (idx === -1) return null;
    return this.memoryStore.careerOpportunities.splice(idx, 1)[0];
  }

  // --- CERTIFICATIONS ---
  async getCertifications() {
    if (this.usingPostgres) return await prisma.certification.findMany({ orderBy: { displayOrder: 'asc' } });
    return [...this.memoryStore.certifications].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCertificationById(id: string) {
    if (this.usingPostgres) return await prisma.certification.findUnique({ where: { id } });
    return this.memoryStore.certifications.find((c: any) => c.id === id) || null;
  }

  async createCertification(data: any) {
    const payload = {
      ...data,
      id: data.id || `cert_${Date.now()}`,
      issueDate: new Date(data.issueDate),
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.certification.create({ data: payload });
    this.memoryStore.certifications.push(payload);
    return payload;
  }

  async updateCertification(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.issueDate) payload.issueDate = new Date(data.issueDate);
    if (data.expirationDate !== undefined) payload.expirationDate = data.expirationDate ? new Date(data.expirationDate) : null;
    if (this.usingPostgres) return await prisma.certification.update({ where: { id }, data: payload });
    const idx = this.memoryStore.certifications.findIndex((c: any) => c.id === id);
    if (idx === -1) return null;
    this.memoryStore.certifications[idx] = { ...this.memoryStore.certifications[idx], ...payload };
    return this.memoryStore.certifications[idx];
  }

  async deleteCertification(id: string) {
    if (this.usingPostgres) return await prisma.certification.delete({ where: { id } });
    const idx = this.memoryStore.certifications.findIndex((c: any) => c.id === id);
    if (idx === -1) return null;
    return this.memoryStore.certifications.splice(idx, 1)[0];
  }

  // --- ACHIEVEMENTS ---
  async getAchievements(query?: { featured?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.featured !== undefined) where.featured = query.featured;
      return await prisma.achievement.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.achievements];
    if (query?.featured !== undefined) list = list.filter((a) => a.featured === query.featured);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getAchievementById(id: string) {
    if (this.usingPostgres) return await prisma.achievement.findUnique({ where: { id } });
    return this.memoryStore.achievements.find((a: any) => a.id === id) || null;
  }

  async createAchievement(data: any) {
    const payload = {
      ...data,
      id: data.id || `ach_${Date.now()}`,
      date: data.date ? new Date(data.date) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.achievement.create({ data: payload });
    this.memoryStore.achievements.push(payload);
    return payload;
  }

  async updateAchievement(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.date !== undefined) payload.date = data.date ? new Date(data.date) : null;
    if (this.usingPostgres) return await prisma.achievement.update({ where: { id }, data: payload });
    const idx = this.memoryStore.achievements.findIndex((a: any) => a.id === id);
    if (idx === -1) return null;
    this.memoryStore.achievements[idx] = { ...this.memoryStore.achievements[idx], ...payload };
    return this.memoryStore.achievements[idx];
  }

  async deleteAchievement(id: string) {
    if (this.usingPostgres) return await prisma.achievement.delete({ where: { id } });
    const idx = this.memoryStore.achievements.findIndex((a: any) => a.id === id);
    if (idx === -1) return null;
    return this.memoryStore.achievements.splice(idx, 1)[0];
  }

  // --- TESTIMONIALS ---
  async getTestimonials(query?: { featured?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.featured !== undefined) where.featured = query.featured;
      return await prisma.testimonial.findMany({ where, orderBy: { displayOrder: 'asc' } });
    }
    let list = [...this.memoryStore.testimonials];
    if (query?.featured !== undefined) list = list.filter((t) => t.featured === query.featured);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getTestimonialById(id: string) {
    if (this.usingPostgres) return await prisma.testimonial.findUnique({ where: { id } });
    return this.memoryStore.testimonials.find((t: any) => t.id === id) || null;
  }

  async createTestimonial(data: any) {
    const payload = {
      ...data,
      id: data.id || `tst_${Date.now()}`,
      date: data.date ? new Date(data.date) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.testimonial.create({ data: payload });
    this.memoryStore.testimonials.push(payload);
    return payload;
  }

  async updateTestimonial(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (data.date !== undefined) payload.date = data.date ? new Date(data.date) : null;
    if (this.usingPostgres) return await prisma.testimonial.update({ where: { id }, data: payload });
    const idx = this.memoryStore.testimonials.findIndex((t: any) => t.id === id);
    if (idx === -1) return null;
    this.memoryStore.testimonials[idx] = { ...this.memoryStore.testimonials[idx], ...payload };
    return this.memoryStore.testimonials[idx];
  }

  async deleteTestimonial(id: string) {
    if (this.usingPostgres) return await prisma.testimonial.delete({ where: { id } });
    const idx = this.memoryStore.testimonials.findIndex((t: any) => t.id === id);
    if (idx === -1) return null;
    return this.memoryStore.testimonials.splice(idx, 1)[0];
  }

  // --- SOCIAL LINKS ---
  async getSocialLinks() {
    if (this.usingPostgres) return await prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } });
    return [...this.memoryStore.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getSocialLinkById(id: string) {
    if (this.usingPostgres) return await prisma.socialLink.findUnique({ where: { id } });
    return this.memoryStore.socialLinks.find((s: any) => s.id === id) || null;
  }

  async createSocialLink(data: any) {
    const payload = { ...data, id: data.id || `soc_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.socialLink.create({ data: payload });
    this.memoryStore.socialLinks.push(payload);
    return payload;
  }

  async updateSocialLink(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.socialLink.update({ where: { id }, data: payload });
    const idx = this.memoryStore.socialLinks.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    this.memoryStore.socialLinks[idx] = { ...this.memoryStore.socialLinks[idx], ...payload };
    return this.memoryStore.socialLinks[idx];
  }

  async deleteSocialLink(id: string) {
    if (this.usingPostgres) return await prisma.socialLink.delete({ where: { id } });
    const idx = this.memoryStore.socialLinks.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    return this.memoryStore.socialLinks.splice(idx, 1)[0];
  }

  // --- CONTACT MESSAGES ---
  async getContactMessages(query?: { search?: string; isRead?: boolean; isArchived?: boolean }) {
    if (this.usingPostgres) {
      const where: any = {};
      if (query?.isRead !== undefined) where.isRead = query.isRead;
      if (query?.isArchived !== undefined) where.isArchived = query.isArchived;
      if (query?.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { subject: { contains: query.search, mode: 'insensitive' } },
          { message: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      return await prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    let list = [...this.memoryStore.contactMessages];
    if (query?.isRead !== undefined) list = list.filter((m) => m.isRead === query.isRead);
    if (query?.isArchived !== undefined) list = list.filter((m) => m.isArchived === query.isArchived);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContactMessageById(id: string) {
    if (this.usingPostgres) return await prisma.contactMessage.findUnique({ where: { id } });
    return this.memoryStore.contactMessages.find((m: any) => m.id === id) || null;
  }

  async createContactMessage(data: any) {
    const payload = {
      ...data,
      id: `msg_${Date.now()}`,
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.usingPostgres) return await prisma.contactMessage.create({ data: payload });
    this.memoryStore.contactMessages.unshift(payload);
    return payload;
  }

  async updateContactMessage(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.contactMessage.update({ where: { id }, data: payload });
    const idx = this.memoryStore.contactMessages.findIndex((m: any) => m.id === id);
    if (idx === -1) return null;
    this.memoryStore.contactMessages[idx] = { ...this.memoryStore.contactMessages[idx], ...payload };
    return this.memoryStore.contactMessages[idx];
  }

  async deleteContactMessage(id: string) {
    if (this.usingPostgres) return await prisma.contactMessage.delete({ where: { id } });
    const idx = this.memoryStore.contactMessages.findIndex((m: any) => m.id === id);
    if (idx === -1) return null;
    return this.memoryStore.contactMessages.splice(idx, 1)[0];
  }

  // --- WEBSITE SETTINGS ---
  async getWebsiteSettings() {
    if (this.usingPostgres) return await prisma.websiteSetting.findMany();
    return [...this.memoryStore.websiteSettings];
  }

  async updateWebsiteSetting(key: string, value: string, description?: string) {
    if (this.usingPostgres) {
      return await prisma.websiteSetting.upsert({
        where: { key },
        update: { value, ...(description ? { description } : {}) },
        create: { key, value, description },
      });
    }
    const existing = this.memoryStore.websiteSettings.find((s: any) => s.key === key);
    if (existing) {
      existing.value = value;
      if (description) existing.description = description;
      existing.updatedAt = new Date();
      return existing;
    }
    const created = { id: `set_${Date.now()}`, key, value, description, createdAt: new Date(), updatedAt: new Date() };
    this.memoryStore.websiteSettings.push(created);
    return created;
  }

  // --- STATISTICS ---
  async getStatistics() {
    if (this.usingPostgres) return await prisma.statistic.findMany({ orderBy: { displayOrder: 'asc' } });
    return [...this.memoryStore.statistics].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateStatistic(id: string, data: any) {
    const payload = { ...data, updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.statistic.update({ where: { id }, data: payload });
    const idx = this.memoryStore.statistics.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    this.memoryStore.statistics[idx] = { ...this.memoryStore.statistics[idx], ...payload };
    return this.memoryStore.statistics[idx];
  }

  async createStatistic(data: any) {
    const payload = { ...data, id: data.id || `stat_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
    if (this.usingPostgres) return await prisma.statistic.create({ data: payload });
    this.memoryStore.statistics.push(payload);
    return payload;
  }

  async deleteStatistic(id: string) {
    if (this.usingPostgres) return await prisma.statistic.delete({ where: { id } });
    const idx = this.memoryStore.statistics.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    return this.memoryStore.statistics.splice(idx, 1)[0];
  }

  // --- DASHBOARD OVERVIEW STATS ---
  async getDashboardOverview() {
    if (this.usingPostgres) {
      const [
        totalProjects,
        publishedProjects,
        featuredProjects,
        totalSkills,
        totalExperiences,
        totalCertifications,
        totalMessages,
        unreadMessages,
        totalCareerOpportunities,
      ] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { published: true } }),
        prisma.project.count({ where: { featured: true } }),
        prisma.skill.count(),
        prisma.experience.count(),
        prisma.certification.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { isRead: false } }),
        prisma.careerOpportunity.count(),
      ]);

      const recentMessages = await prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return {
        totalProjects,
        publishedProjects,
        featuredProjects,
        totalSkills,
        totalExperiences,
        totalCertifications,
        totalMessages,
        unreadMessages,
        totalCareerOpportunities,
        recentMessages,
      };
    }

    return {
      totalProjects: this.memoryStore.projects.length,
      publishedProjects: this.memoryStore.projects.filter((p: any) => p.published).length,
      featuredProjects: this.memoryStore.projects.filter((p: any) => p.featured).length,
      totalSkills: this.memoryStore.skills.length,
      totalExperiences: this.memoryStore.experiences.length,
      totalCertifications: this.memoryStore.certifications.length,
      totalMessages: this.memoryStore.contactMessages.length,
      unreadMessages: this.memoryStore.contactMessages.filter((m: any) => !m.isRead).length,
      totalCareerOpportunities: this.memoryStore.careerOpportunities.length,
      recentMessages: this.memoryStore.contactMessages.slice(0, 5),
    };
  }
}

export const dbService = new DatabaseService();
