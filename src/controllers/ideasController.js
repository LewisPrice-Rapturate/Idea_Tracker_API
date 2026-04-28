import {
  getAllIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
} from '../services/ideasService.js';

export async function getAllIdeasHandler(req, res) {
  const {
    search = '',
    sortBy = 'date_created',
    order = 'desc',
    offset = '0',
    limit = '10',
  } = req.query;

  const options = {
    search,
    sortBy,
    order,
    offset: parseInt(offset),
    limit: parseInt(limit),
  };

  const ideas = await getAllIdeas(req.user.id, options);
  res.status(200).json(ideas);
}
export async function createIdeaHandler(req, res) {
  const { name, description } = req.body;
  const newIdea = await createIdea(req.user.id, { name, description });
  res.status(201).json(newIdea);
}
export async function updateIdeaHandler(req, res) {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const updatedIdea = await updateIdea(id, req.user.id, { name, description });
  res.status(200).json(updatedIdea);
}
export async function deleteIdeaHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteIdea(id, req.user.id);
  res.status(204).send();
}
