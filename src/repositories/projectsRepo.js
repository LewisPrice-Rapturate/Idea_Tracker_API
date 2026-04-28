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
    console.log('projectsRepo.getAll() called for userId:', userId);
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : 'date_created';
  const safeOrder = order === 'asc' ? 'asc' : 'desc';

  const projects = await prisma.project.findMany({
    where: {
      userId,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { [safeSortBy]: safeOrder },
    skip: offset,
    take: limit,
    include: { files: true },
  });

  return projects;
}

export async function getById(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsRepo.getById() called for projectId:',
      projectId,
      'userId:',
      userId
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { files: true },
  });

  if (project && project.userId !== userId) {
    return null;
  }

  return project;
}

export async function create(userId, projectData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsRepo.create() called with data:', projectData);
  }

  const newProject = await prisma.project.create({
    data: { ...projectData, userId },
    include: { files: true },
  });

  return newProject;
}

export async function update(projectId, userId, updatedData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsRepo.update() called for projectId:',
      projectId,
      'with data:',
      updatedData
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return null;
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updatedData,
      include: { files: true },
    });

    return updatedProject;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsRepo.remove() called for projectId:', projectId);
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return null;
    }

    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
      include: { files: true },
    });

    return deletedProject;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function existsByName(userId, name) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsRepo.existsByName() called for name:', name);
  }

  const project = await prisma.project.findFirst({
    where: { userId, name },
  });

  return project !== null;
}

export async function getFilesByProjectId(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsRepo.getFilesByProjectId() called for projectId:',
      projectId,
      'userId:',
      userId
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return null;
    }

    const files = await prisma.file.findMany({
      where: { projectId },
    });

    return files;
  } catch (error) {
    throw error;
  }
}

export async function addFile(projectId, userId, fileData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsRepo.addFile() called for projectId:',
      projectId,
      'userId:',
      userId,
      'with data:',
      fileData
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== userId) {
    return null;
  }

  const newFile = await prisma.file.create({
    data: {
      name: fileData.name,
      file: fileData.file,
      size: fileData.size,
      mimeType: fileData.mimeType,
      projectId: projectId
    }
  });

  return newFile;
}

export async function deleteFile(fileId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsRepo.deleteFile() called for fileId:', fileId, 'userId:', userId);
  }

  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { project: true }
  });

  if (!file || file.project.userId !== userId) {
    return null;
  }

  return await prisma.file.delete({
    where: { id: fileId },
  });
}

export async function getFilesWithContent(projectId, userId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== userId) return null;

  return await prisma.file.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      file: true,
      size: true,
      mimeType: true,
      projectId: true
    }
  });
}