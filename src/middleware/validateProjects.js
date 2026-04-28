import { param, query, body, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateGetAllQuery = [
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),

  query('sortBy')
    .optional()
    .isIn(['name', 'date_created'])
    .withMessage('sortBy must be one of: name, date_created'),

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

export const validateCreateProject = [
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

  handleValidationErrors,
];

export const validateUpdateProject = [
  oneOf(
    [
      body('name').exists({ checkFalsy: true }),
      body('description').exists({ checkFalsy: true }),
    ],
    { message: 'At least one field (name, description) must be provided' }
  ),

  body('name')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('description')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('Description must be a string'),

  handleValidationErrors,
];
