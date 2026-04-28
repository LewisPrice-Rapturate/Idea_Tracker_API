import prisma from '../config/db.js';

const ALLOWED_SORT_FIELDS = ['name', 'date_created'];

export async function getAll(
  userId,
  {
    search = '',
    sortBy = 'date_created',
    order = 'desc',
    offset = 0,
    limit = 10,
  } = {}
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasRepo.getAll() called for userId:', userId);
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : 'date_created';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';

  const ideas = await prisma.idea.findMany({
    where: {
      userId,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { [safeSortBy]: safeOrder },
    skip: offset,
    take: limit,
  });

  return ideas;
}

export async function getById(ideaId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'ideasRepo.getById() called for ideaId:',
      ideaId,
      'userId:',
      userId
    );
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (idea && idea.userId !== userId) {
    return null;
  }

  return idea;
}

export async function create(userId, ideaData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasRepo.create() called with data:', ideaData);
  }

  const newIdea = await prisma.idea.create({
    data: {
      ...ideaData,
      userId,
    },
  });

  return newIdea;
}

export async function update(ideaId, userId, updatedData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'ideasRepo.update() called for ideaId:',
      ideaId,
      'with data:',
      updatedData
    );
  }

  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea || idea.userId !== userId) {
      return null;
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: updatedData,
    });

    return updatedIdea;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(ideaId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasRepo.remove() called for ideaId:', ideaId);
  }

  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea || idea.userId !== userId) {
      return null;
    }

    const deletedIdea = await prisma.idea.delete({
      where: { id: ideaId },
    });

    return deletedIdea;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function existsByName(userId, name) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasRepo.existsByName() called for name:', name);
  }

  const idea = await prisma.idea.findFirst({
    where: { userId, name },
  });

  return idea !== null;
}
