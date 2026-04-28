import express from 'express';
import {
  getAllIdeasHandler,
  createIdeaHandler,
  updateIdeaHandler,
  deleteIdeaHandler,
} from '../controllers/ideasController.js';
import {
  validateGetAllQuery,
  validateId,
  validateCreateIdea,
  validateUpdateIdea,
} from '../middleware/validateIdeas.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', validateGetAllQuery, getAllIdeasHandler);
router.post('/', validateCreateIdea, createIdeaHandler);
router.put('/:id', validateId, validateUpdateIdea, updateIdeaHandler);
router.delete('/:id', validateId, deleteIdeaHandler);

export default router;
