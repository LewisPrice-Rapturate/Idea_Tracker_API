import express from 'express';
import { logInHandler, signUpHandler } from '../controllers/authController.js';
import { validateSignUp, validateLogIn } from '../middleware/validateAuth.js';

const router = express.Router();

router.post('/signup', validateSignUp, signUpHandler);
router.post('/login', validateLogIn, logInHandler);

export default router;
