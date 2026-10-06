export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  lastLoginAt?: string | null;
}

export interface Profile {
  id: string;
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  longBio: string;
  profileImage?: string | null;
  location: string;
  email: string;
  phone?: string | null;
  availabilityStatus: string;
  yearsOfExperience: number;
  resumeUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string | null;
  description?: string | null;
  displayOrder: number;
  featured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  companyName: string;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  displayOrder: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  institution: string;
  institutionLogo?: string | null;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  currentlyStudying: boolean;
  description?: string | null;
  achievements: string[];
  grade?: string | null;
  website?: string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  galleryImages: string[];
  technologies: string[];
  category: string;
  projectType: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  caseStudyUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  challenges?: string | null;
  solutions?: string | null;
  keyFeatures: string[];
  responsibilities?: string | null;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon?: string | null;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  technologies: string[];
  displayOrder: number;
  featured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerOpportunity {
  id: string;
  companyName: string;
  companyLogo?: string | null;
  jobTitle: string;
  location: string;
  country?: string | null;
  remoteType: string;
  employmentType: string;
  jobDescription: string;
  requiredSkills: string[];
  salaryRange?: string | null;
  jobUrl?: string | null;
  applicationUrl: string;
  companyWebsite?: string | null;
  postedDate: string;
  closingDate?: string | null;
  status: string;
  featured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuingOrganization: string;
  organizationLogo?: string | null;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImage?: string | null;
  description?: string | null;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  image?: string | null;
  date?: string | null;
  organization?: string | null;
  url?: string | null;
  displayOrder: number;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  profileImage?: string | null;
  testimonial: string;
  rating: number;
  date?: string | null;
  featured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string | null;
}

export interface Statistic {
  id: string;
  label: string;
  value: string;
  icon?: string | null;
  displayOrder: number;
}

export interface DashboardOverview {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalCertifications: number;
  totalMessages: number;
  unreadMessages: number;
  totalCareerOpportunities: number;
  recentMessages: ContactMessage[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}
