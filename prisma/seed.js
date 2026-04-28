import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/config/db.js';

try {
  await prisma.$queryRaw`TRUNCATE users, ideas, projects, materials, files RESTART IDENTITY CASCADE;`;

  // Create users
  const usersData = [
    { username: 'alice_dev', password: 'alice1234' },
    { username: 'bob_maker', password: 'bob1234' },
    { username: 'charlie_creator', password: 'charlie1234' },
  ];

  const users = [];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
      },
    });

    users.push(user);
  }

  // Create ideas for each user
  for (const user of users) {
    await prisma.idea.createMany({
      data: [
        {
          name: 'AI-Powered Task Manager',
          description:
            'A web app that uses AI to prioritize tasks intelligently based on user patterns.',
          userId: user.id,
        },
        {
          name: 'Community Recipe Hub',
          description:
            'A platform where users can share, rate, and discover recipes from around the world.',
          userId: user.id,
        },
        {
          name: 'Real-time Collaboration Tool',
          description:
            'A tool for teams to brainstorm and collaborate in real-time with visual whiteboarding.',
          userId: user.id,
        },
      ],
    });
  }

  // Create projects with materials for each user
  for (const user of users) {
    const project = await prisma.project.create({
      data: {
        name: `${user.username}'s Innovation Lab`,
        description: `Main project workspace for ${user.username} to develop and prototype ideas.`,
        userId: user.id,
      },
    });

    // Add materials to the project
    await prisma.material.createMany({
      data: [
        {
          name: 'Research Paper on UX Design',
          description: 'Key findings on modern UI/UX best practices.',
          source: 'Nielsen Norman Group',
          author: 'Don Norman',
          text: 'User experience encompasses all aspects of the end-users interaction with the company, its services, and its products.',
          projectId: project.id,
        },
        {
          name: 'API Documentation Reference',
          description: 'Technical specifications for third-party integrations.',
          source: 'OpenAI API Docs',
          author: 'OpenAI Team',
          text: 'The API provides access to state-of-the-art language models for various NLP tasks.',
          projectId: project.id,
        },
        {
          name: 'Project Budget Template',
          description: 'Financial planning and resource allocation framework.',
          source: 'Internal Resources',
          author: 'Finance Department',
          text: 'Ensure all project expenses are tracked and approved according to company policy.',
          projectId: project.id,
        },
      ],
    });
  }

  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}
