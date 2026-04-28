import prisma from '../config/db.js';

export async function createUser(data) {
  if (process.env.NODE_ENV === 'development') {
    console.log('userRepo.createUser() called for username:', data.username);
  }

  try {
    const newUser = await prisma.user.create({
      data,
      omit: { password: true },
    });
    return newUser;
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('Username already exists');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function findUserByUsername(username) {
  if (process.env.NODE_ENV === 'development') {
    console.log('userRepo.findUserByUsername() called for username:', username);
  }

  return await prisma.user.findUnique({ where: { username } });
}
