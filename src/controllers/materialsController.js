import {
  getAllMaterials,
  getMaterialsByProject,
  getMaterialById,
  createMaterial,
  deleteMaterial,
} from '../services/materialsService.js';

export async function getAllMaterialsHandler(req, res) {
  const {
    search = '',
    sortBy = 'id',
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

  const materials = await getAllMaterials(req.user.id, options);
  res.status(200).json(materials);
}

export async function getMaterialsByProjectHandler(req, res) {
  const projectId = parseInt(req.params.projectId);
  const {
    search = '',
    sortBy = 'id',
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

  const materials = await getMaterialsByProject(
    projectId,
    req.user.id,
    options
  );
  res.status(200).json(materials);
}

export async function getMaterialByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const material = await getMaterialById(id, req.user.id);
  res.status(200).json(material);
}

export async function createMaterialHandler(req, res) {
  const { projectId, name, description, source, author, text } = req.body;
  const newMaterial = await createMaterial(req.user.id, {
    projectId,
    name,
    description,
    source,
    author,
    text,
  });
  res.status(201).json(newMaterial);
}

export async function deleteMaterialHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteMaterial(id, req.user.id);
  res.status(204).send();
}
