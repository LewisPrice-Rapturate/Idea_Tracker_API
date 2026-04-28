import {
  getAll,
  getById,
  create,
  update,
  remove,
  existsByName,
} from '../repositories/ideasRepo.js';

export async function getAllIdeas(userId, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasService.getAllIdeas() called for userId:', userId);
  }

  const ideas = await getAll(userId, options);
  return ideas;
}

export async function getIdeaById(ideaId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasService.getIdeaById() called for ideaId:', ideaId);
  }

  const idea = await getById(ideaId, userId);
  if (idea) return idea;

  const error = new Error(`Idea ${ideaId} not found`);
  error.status = 404;
  throw error;
}

export async function createIdea(userId, ideaData) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasService.createIdea() called with data:', ideaData);
  }

  const ideaExists = await existsByName(userId, ideaData.name);
  if (ideaExists) {
    const error = new Error(`Idea with name "${ideaData.name}" already exists`);
    error.status = 409;
    throw error;
  }

  const newIdea = await create(userId, ideaData);
  return newIdea;
}

export async function updateIdea(ideaId, userId, updatedData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'ideasService.updateIdea() called for ideaId:',
      ideaId,
      'with data:',
      updatedData
    );
  }

  if (updatedData.name) {
    const ideaExists = await existsByName(userId, updatedData.name);
    if (ideaExists) {
      const error = new Error(
        `Idea with name "${updatedData.name}" already exists`
      );
      error.status = 409;
      throw error;
    }
  }

  const updatedIdea = await update(ideaId, userId, updatedData);
  if (updatedIdea) return updatedIdea;

  const error = new Error(`Idea ${ideaId} not found`);
  error.status = 404;
  throw error;
}

export async function deleteIdea(ideaId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ideasService.deleteIdea() called for ideaId:', ideaId);
  }

  const result = await remove(ideaId, userId);
  if (result) return;

  const error = new Error(`Idea ${ideaId} not found`);
  error.status = 404;
  throw error;
}
