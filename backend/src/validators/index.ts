import { z } from 'zod';

// --- AUTH ---
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// --- PROFILE ---
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  professionalTitle: z.string().min(2, 'Professional title is required'),
  shortBio: z.string().min(10, 'Short bio must be at least 10 characters'),
  longBio: z.string().min(20, 'Long bio must be at least 20 characters'),
  profileImage: z.string().optional().nullable(),
  location: z.string().min(2, 'Location is required'),
  email: z.string().email('Please enter a valid contact email'),
  phone: z.string().optional().nullable(),
  availabilityStatus: z.string().min(2, 'Availability status is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be non-negative'),
  resumeUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
});

// --- SKILL ---
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.number().min(0).max(100, 'Proficiency must be between 0 and 100'),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'At least one ID is required'),
});

// --- EXPERIENCE ---
export const experienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().optional().nullable(),
  companyWebsite: z.string().optional().nullable(),
  jobTitle: z.string().min(1, 'Job title is required'),
  employmentType: z.string().default('Full-time'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologiesUsed: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
});

// --- EDUCATION ---
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  institutionLogo: z.string().optional().nullable(),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  currentlyStudying: z.boolean().default(false),
  description: z.string().optional().nullable(),
  achievements: z.array(z.string()).default([]),
  grade: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
});

// --- PROJECT ---
export const projectSchema = z.object({
  title: z.string().min(2, 'Project title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
  featuredImage: z.string().min(1, 'Featured image is required'),
  galleryImages: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.string().min(1, 'Category is required'),
  projectType: z.string().default('Web Application'),
  liveUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  caseStudyUrl: z.string().optional().nullable(),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  status: z.string().default('Completed'),
  challenges: z.string().optional().nullable(),
  solutions: z.string().optional().nullable(),
  keyFeatures: z.array(z.string()).default([]),
  responsibilities: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

// --- SERVICE ---
export const serviceSchema = z.object({
  title: z.string().min(2, 'Service title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  icon: z.string().optional().nullable(),
  shortDescription: z.string().min(10, 'Short description is required'),
  fullDescription: z.string().min(20, 'Full description is required'),
  features: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// --- CAREER OPPORTUNITY ---
export const careerOpportunitySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().optional().nullable(),
  jobTitle: z.string().optional().default('Career Opportunities'),
  location: z.string().optional().default('Remote / Global'),
  country: z.string().optional().nullable(),
  remoteType: z.string().default('Remote'),
  employmentType: z.string().default('Full-time'),
  jobDescription: z.string().default(''),
  requiredSkills: z.array(z.string()).default([]),
  salaryRange: z.string().optional().nullable(),
  jobUrl: z.string().optional().nullable(),
  careerUrl: z.string().optional().nullable(),
  careerPageUrl: z.string().optional().nullable(),
  applicationUrl: z.string().optional().nullable(),
  companyWebsite: z.string().optional().nullable(),
  postedDate: z.string().or(z.date()).optional(),
  closingDate: z.string().or(z.date()).optional().nullable(),
  status: z.string().default('Open'),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

// --- CERTIFICATION ---
export const certificationSchema = z.object({
  title: z.string().min(1, 'Certification title is required'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required'),
  organizationLogo: z.string().optional().nullable(),
  issueDate: z.string().or(z.date()),
  expirationDate: z.string().or(z.date()).optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  certificateImage: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
});

// --- ACHIEVEMENT ---
export const achievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().min(5, 'Description is required'),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  date: z.string().or(z.date()).optional().nullable(),
  organization: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
});

// --- TESTIMONIAL ---
export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  company: z.string().min(1, 'Company is required'),
  profileImage: z.string().optional().nullable(),
  testimonial: z.string().min(10, 'Testimonial text must be at least 10 characters'),
  rating: z.number().int().min(1).max(5).default(5),
  date: z.string().or(z.date()).optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

// --- SOCIAL LINK ---
export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// --- CONTACT MESSAGE ---
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Honeypot field for anti-spam: bots often fill this hidden field
  honeypot: z.string().optional(),
});

// --- WEBSITE SETTING ---
export const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  description: z.string().optional().nullable(),
});

// --- STATISTIC ---
export const statisticSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  icon: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
});
