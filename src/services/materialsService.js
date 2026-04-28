import {
  getAll,
  getByProjectId,
  getById,
  create,
  remove,
  existsByName,
} from '../repositories/materialsRepo.js';

export async function getAllMaterials(userId, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsService.getAllMaterials() called for userId:',
      userId
    );
  }

  const materials = await getAll(userId, options);
  return materials;
}

export async function getMaterialsByProject(projectId, userId, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsService.getMaterialsByProject() called for projectId:',
      projectId
    );
  }

  const materials = await getByProjectId(projectId, userId, options);
  return materials;
}

export async function getMaterialById(materialId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsService.getMaterialById() called for materialId:',
      materialId
    );
  }

  const material = await getById(materialId, userId);
  if (material) return material;

  const error = new Error(`Material ${materialId} not found`);
  error.status = 404;
  throw error;
}

export async function createMaterial(userId, materialData) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsService.createMaterial() called with data:',
      materialData
    );
  }

  const materialExists = await existsByName(userId, materialData.name);
  if (materialExists) {
    const error = new Error(
      `Material with name "${materialData.name}" already exists`
    );
    error.status = 409;
    throw error;
  }

  const newMaterial = await create(userId, materialData);
  return newMaterial;
}

export async function deleteMaterial(materialId, userId) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'materialsService.deleteMaterial() called for materialId:',
      materialId
    );
  }

  const result = await remove(materialId, userId);
  if (result) return;

  const error = new Error(`Material ${materialId} not found`);
  error.status = 404;
  throw error;
}
