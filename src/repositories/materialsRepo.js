import prisma from '../config/db.js';

const ALLOWED_SORT_FIELDS = ['name', 'id'];

export async function getAll(
  userId,
  { search = '', sortBy = 'id', order = 'desc', offset = 0, limit = 10 } = {}
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('materialsRepo.getAll() called for userId:', userId);
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'id';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';

  const materials = await prisma.material.findMany({
    where: {
      project: { userId },
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { [safeSortBy]: safeOrder },
    skip: offset,
    take: limit,
  });

  return materials;
}

export async function getByProjectId(
  projectId,
  userId,
  { search = '', sortBy = 'id', order = 'desc', offset = 0, limit = 10 } = {}
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsRepo.getByProjectId() called for projectId:',
      projectId,
      'userId:',
      userId
    );
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'id';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';

  const materials = await prisma.material.findMany({
    where: {
      projectId,
      project: { userId },
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { [safeSortBy]: safeOrder },
    skip: offset,
    take: limit,
  });

  return materials;
}

export async function getById(materialId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsRepo.getById() called for materialId:',
      materialId,
      'userId:',
      userId
    );
  }

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { project: true },
  });

  if (material && material.project.userId !== userId) {
    return null;
  }

  return material;
}

export async function create(userId, materialData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('materialsRepo.create() called with data:', materialData);
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: materialData.projectId },
    });

    if (!project || project.userId !== userId) {
      return null;
    }

    const newMaterial = await prisma.material.create({
      data: materialData,
    });

    return newMaterial;
  } catch (error) {
    throw error;
  }
}

export async function remove(materialId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('materialsRepo.remove() called for materialId:', materialId);
  }

  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { project: true },
    });

    if (!material || material.project.userId !== userId) {
      return null;
    }

    const deletedMaterial = await prisma.material.delete({
      where: { id: materialId },
    });

    return deletedMaterial;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function existsByName(userId, name) {
  if (process.env.NODE_ENV === 'development') {
    console.log('materialsRepo.existsByName() called for name:', name);
  }

  const material = await prisma.material.findFirst({
    where: { name, project: { userId } },
  });

  return material !== null;
}
