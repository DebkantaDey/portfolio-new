'use client';

import React, { useEffect, useState } from 'react';
import { Hero } from '../components/home/Hero';
import { TechStack } from '../components/home/TechStack';
import { StatsSection } from '../components/home/StatsSection';
import { AboutSection } from '../components/home/AboutSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { ServicesSection } from '../components/home/ServicesSection';
import { CareerSection } from '../components/home/CareerSection';
import { EducationSection } from '../components/home/EducationSection';
import { CertificationsSection } from '../components/home/CertificationsSection';
import { AchievementsSection } from '../components/home/AchievementsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ResumeCTA } from '../components/home/ResumeCTA';
import { ContactSection } from '../components/home/ContactSection';
import { api } from '../lib/api';
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
  Statistic,
} from '../types';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [careerOpportunities, setCareerOpportunities] = useState<CareerOpportunity[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [
          profileRes,
          statsRes,
          skillsRes,
          expRes,
          projRes,
          srvRes,
          carRes,
          eduRes,
          certRes,
          achRes,
          testRes,
        ] = await Promise.allSettled([
          api.getProfile(),
          api.getStatistics(),
          api.getSkills(),
          api.getExperiences(),
          api.getProjects(),
          api.getServices(),
          api.getCareerOpportunities(),
          api.getEducations(),
          api.getCertifications(),
          api.getAchievements(),
          api.getTestimonials(),
        ]);

        if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
        if (skillsRes.status === 'fulfilled') {
          setSkills([...skillsRes.value].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
        }
        if (expRes.status === 'fulfilled') setExperiences(expRes.value);
        if (projRes.status === 'fulfilled') setProjects(projRes.value);
        if (srvRes.status === 'fulfilled') setServices(srvRes.value);
        if (carRes.status === 'fulfilled') setCareerOpportunities(carRes.value);
        if (eduRes.status === 'fulfilled') setEducations(eduRes.value);
        if (certRes.status === 'fulfilled') setCertifications(certRes.value);
        if (achRes.status === 'fulfilled') setAchievements(achRes.value);
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value);
      } catch (err) {
        console.error('Error loading homepage portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero profile={profile} />

      {/* 2. Trusted Technologies */}
      <TechStack />

      {/* 3. Professional Statistics */}
      <StatsSection stats={stats} />

      {/* 4. About Me */}
      <AboutSection profile={profile} />

      {/* 5. Skills Section */}
      <SkillsSection skills={skills} />

      {/* 6. Work Experience Timeline */}
      <ExperienceSection experiences={experiences} />

      {/* 7. Featured Projects */}
      <FeaturedProjects projects={projects} />

      {/* 8. Professional Services */}
      <ServicesSection services={services} />

      {/* 9. Open to Opportunities / Career Section */}
      <CareerSection opportunities={careerOpportunities} />

      {/* 10. Education */}
      <EducationSection educations={educations} />

      {/* 11. Certifications */}
      <CertificationsSection certifications={certifications} />

      {/* 12. Achievements */}
      <AchievementsSection achievements={achievements} />

      {/* 13. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 14. Resume CTA */}
      <ResumeCTA resumeUrl={profile?.resumeUrl} />

      {/* 15. Contact Section */}
      <ContactSection profile={profile} />
    </div>
  );
}
