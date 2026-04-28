import bcrypt from 'bcrypt';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedFilesDir = path.join(__dirname, 'seed_files');

try {
 // Clearing the database
  if (process.env.NODE_ENV !== 'production') {
    console.log('Clearing database for development seed...');
    await prisma.$queryRaw`TRUNCATE users, ideas, projects, materials, files RESTART IDENTITY CASCADE;`;
  }

// Creating my users
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
    console.log(`Created user: ${user.username}`);
  }

  // Each user gets 3 Ideas, each Idea gets 3 Projects, each Project gets 3 Materials and 3 Files
  for (const user of users) {
    await prisma.idea.createMany({
      data: [
        { name: `${user.username} Idea 1`, description: 'Smart Tasking', userId: user.id },
        { name: `${user.username} Idea 2`, description: 'Recipe Hub', userId: user.id },
        { name: `${user.username} Idea 3`, description: 'Collab Tool', userId: user.id },
      ],
    });

    for (let p = 1; p <= 3; p++) {
      const project = await prisma.project.create({
        data: {
          name: `${user.username} Project ${p}`,
          description: `Workspace for project ${p}`,
          userId: user.id,
        },
      });

      await prisma.material.createMany({
        data: [
          { name: 'Research Paper', description: 'UX findings', source: 'Group A', author: 'Don Norman', text: 'Sample text...', projectId: project.id },
          { name: 'API Docs', description: 'Specs', source: 'Dev Portal', author: 'Team B', text: 'Technical data...', projectId: project.id },
          { name: 'Budget Template', description: 'Finance', source: 'Internal', author: 'Dept C', text: 'Allocations...', projectId: project.id },
        ],
      });

      // Create 3 Files for each project (pulling from seed_files folder), I put one of each mime type listed on line 94 and it will reuse any to make sure each user has 3. 
      if (fs.existsSync(seedFilesDir)) {
        const availableFiles = fs.readdirSync(seedFilesDir);
        if (availableFiles.length > 0) {
          for (let f = 0; f < 3; f++) {
            const filename = availableFiles[f % availableFiles.length];
            const filePath = path.join(seedFilesDir, filename);
            const stats = fs.statSync(filePath);
            const fileBuffer = fs.readFileSync(filePath);

            await prisma.file.create({
              data: {
                name: `U${user.id}_P${project.id}_${f}_${filename}`,
                file: fileBuffer,
                size: stats.size,
                mimeType: getMimeType(filename),
                projectId: project.id,
              },
            });
          }
        }
      }
    }
  }

  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimes = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.png': 'image/png',
    '.cpp': 'text/x-c',
    '.txt': 'text/plain',
  };
  return mimes[ext] || 'application/octet-stream';
}