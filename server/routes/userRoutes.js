import express from 'express';
import { register } from '../controllers/usersController.js';
import { login } from '../controllers/usersController.js';
import {setAvatar} from '../controllers/usersController.js'
import { getAllUsers } from '../controllers/usersController.js';
import { logout } from '../controllers/usersController.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logout);

export default router;