import {
  getAll,
  getById,
  create,
  update,
  remove,
  existsByName,
  getFilesByProjectId,
  getFilesWithContent,
  addFile,
  deleteFile
} from '../repositories/projectsRepo.js';

export async function getAllProjects(userId, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsService.getAllProjects() called for userId:', userId);
  }
  return await getAll(userId, options);
}

export async function getProjectById(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.getProjectById() called for projectId:',
      projectId
    );
  }

  const project = await getById(projectId, userId);
  if (project) return project;

  const error = new Error(`Project ${projectId} not found`);
  error.status = 404;
  throw error;
}

export async function createProject(userId, projectData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.createProject() called with data:',
      projectData
    );
  }

  const projectExists = await existsByName(userId, projectData.name);
  if (projectExists) {
    const error = new Error(
      `Project with name "${projectData.name}" already exists`
    );
    error.status = 409;
    throw error;
  }

  const newProject = await create(userId, projectData);
  return newProject;
}

export async function updateProject(projectId, userId, updatedData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.updateProject() called for projectId:',
      projectId,
      'with data:',
      updatedData
    );
  }

  if (updatedData.name) {
    const projectExists = await existsByName(userId, updatedData.name);
    if (projectExists) {
      const error = new Error(
        `Project with name "${updatedData.name}" already exists`
      );
      error.status = 409;
      throw error;
    }
  }

  const updatedProject = await update(projectId, userId, updatedData);
  if (updatedProject) return updatedProject;

  const error = new Error(`Project ${projectId} not found`);
  error.status = 404;
  throw error;
}

export async function deleteProject(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.deleteProject() called for projectId:',
      projectId
    );
  }

  const result = await remove(projectId, userId);
  if (result) return;

  const error = new Error(`Project ${projectId} not found`);
  error.status = 404;
  throw error;
}

export async function getProjectFilesById(projectId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.getProjectFilesById() called for projectId:',
      projectId
    );
  }

  const files = await getFilesByProjectId(projectId, userId);
  if (files) return files;

  const error = new Error(`Project ${projectId} not found`);
  error.status = 404;
  throw error;
}

export async function getProjectFilesForDownload(projectId, userId) {
  const files = await getFilesWithContent(projectId, userId);
  if (!files) {
    const error = new Error(`Project ${projectId} not found or unauthorized`);
    error.status = 404;
    throw error;
  }
  return files;
}

export async function addProjectFile(projectId, userId, fileData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'projectsService.addProjectFile() called for projectId:',
      projectId,
      'with fileData:',
      fileData
    );
  }

  const newFile = await addFile(projectId, userId, fileData);
  if (!newFile) {
    const error = new Error(`Project ${projectId} not found or unauthorized`);
    error.status = 404;
    throw error;
  }
  return newFile;
}

export async function deleteProjectFile(fileId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('projectsService.deleteProjectFile() called for fileId:', fileId);
  }

  const deletedFile = await deleteFile(fileId, userId);
  if (deletedFile) return deletedFile;
}
