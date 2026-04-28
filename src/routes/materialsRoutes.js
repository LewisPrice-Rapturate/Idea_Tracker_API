import express from 'express';
import {
  getAllMaterialsHandler,
  getMaterialsByProjectHandler,
  getMaterialByIdHandler,
  createMaterialHandler,
  deleteMaterialHandler,
} from '../controllers/materialsController.js';
import {
  validateGetAllQuery,
  validateId,
  validateProjectId,
  validateCreateMaterial,
} from '../middleware/validateMaterials.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', validateGetAllQuery, getAllMaterialsHandler);
router.get(
  '/project/:projectId',
  validateProjectId,
  validateGetAllQuery,
  getMaterialsByProjectHandler
);
router.get('/:id', validateId, getMaterialByIdHandler);
router.post('/', validateCreateMaterial, createMaterialHandler);
router.delete('/:id', validateId, deleteMaterialHandler);

export default router;
