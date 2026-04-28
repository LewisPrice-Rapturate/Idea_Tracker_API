import { param, query, body } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateGetAllQuery = [
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),

  query('sortBy')
    .optional()
    .isIn(['name', 'id'])
    .withMessage('sortBy must be one of: name, id'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be asc or desc'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a non-negative integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),

  handleValidationErrors,
];

export const validateId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),
  handleValidationErrors,
];

export const validateProjectId = [
  param('projectId')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('ProjectId must be a positive integer'),

  handleValidationErrors,
];

export const validateCreateMaterial = [
  body('projectId')
    .exists({ checkFalsy: true })
    .withMessage('ProjectId is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('ProjectId must be a positive integer'),

  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('Description must be a string'),

  body('source')
    .exists({ checkFalsy: true })
    .withMessage('Source is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('Source must be a string'),

  body('author')
    .exists({ checkFalsy: true })
    .withMessage('Author is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('Author must be a string'),

  body('text')
    .exists({ checkFalsy: true })
    .withMessage('Text is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('Text must be a string'),

  handleValidationErrors,
];
