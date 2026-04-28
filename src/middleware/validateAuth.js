import { body } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateSignUp = [
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  handleValidationErrors,
];

export const validateLogIn = [
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required'),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),

  handleValidationErrors,
];
