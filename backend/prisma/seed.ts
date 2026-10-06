import { PrismaClient } from '@prisma/client';
import { getInitialData } from '../src/utils/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database...');
  const data = await getInitialData();

  // 1. Admin User
  await prisma.user.upsert({
    where: { email: data.adminUser.email },
    update: {
      name: data.adminUser.name,
      passwordHash: data.adminUser.passwordHash,
      role: data.adminUser.role,
      avatar: data.adminUser.avatar,
    },
    create: data.adminUser,
  });
  console.log('Admin user seeded:', data.adminUser.email);

  // 2. Profile
  const existingProfile = await prisma.profile.findFirst();
  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: data.profile,
    });
  } else {
    await prisma.profile.create({
      data: data.profile,
    });
  }
  console.log('Profile seeded');

  // 3. Statistics
  for (const stat of data.statistics) {
    await prisma.statistic.upsert({
      where: { id: stat.id },
      update: stat,
      create: stat,
    });
  }

  // 4. Skills
  for (const sk of data.skills) {
    await prisma.skill.upsert({
      where: { id: sk.id },
      update: sk,
      create: sk,
    });
  }

  // 5. Experiences
  for (const exp of data.experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp,
    });
  }

  // 6. Educations
  for (const edu of data.educations) {
    await prisma.education.upsert({
      where: { id: edu.id },
      update: edu,
      create: edu,
    });
  }

  // 7. Projects
  for (const proj of data.projects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj,
    });
  }

  // 8. Services
  for (const srv of data.services) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: srv,
      create: srv,
    });
  }

  // 9. Career Opportunities
  for (const car of data.careerOpportunities) {
    await prisma.careerOpportunity.upsert({
      where: { id: car.id },
      update: car,
      create: car,
    });
  }

  // 10. Certifications
  for (const cert of data.certifications) {
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: cert,
      create: cert,
    });
  }

  // 11. Achievements
  for (const ach of data.achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: ach,
      create: ach,
    });
  }

  // 12. Testimonials
  for (const tst of data.testimonials) {
    await prisma.testimonial.upsert({
      where: { id: tst.id },
      update: tst,
      create: tst,
    });
  }

  // 13. Social Links
  for (const soc of data.socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: soc.id },
      update: soc,
      create: soc,
    });
  }

  // 14. Website Settings
  for (const st of data.websiteSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: st.key },
      update: { value: st.value, description: st.description },
      create: st,
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
