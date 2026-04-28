import express from 'express';
import multer from 'multer';
import {
  getAllProjectsHandler,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getProjectFilesHandler,
  addProjectFileHandler,
  deleteProjectFileHandler,
  downloadProjectFilesHandler
} from '../controllers/projectsController.js';
import {
  validateGetAllQuery,
  validateId,
  validateCreateProject,
  validateUpdateProject,
} from '../middleware/validateProjects.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.use(authenticate);

//Project Routes
router.get('/', validateGetAllQuery, getAllProjectsHandler);
router.get('/:id', validateId, getProjectByIdHandler);
router.post('/', validateCreateProject, createProjectHandler);
router.put('/:id', validateId, validateUpdateProject, updateProjectHandler);
router.delete('/:id', validateId, deleteProjectHandler);

// Project File Routes
router.get('/:id/files', validateId, getProjectFilesHandler);
router.post('/:id/files', validateId, upload.single('file'), addProjectFileHandler);
router.delete('/files/:id', validateId, deleteProjectFileHandler);
router.get('/:id/files/download', validateId, downloadProjectFilesHandler);

export default router;
