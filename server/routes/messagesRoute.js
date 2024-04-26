import express from 'express';
import { getMessages, addMessage, getNotifies } from '../controllers/messagesController.js';


const router = express.Router();

router.post('/getmsg', getMessages);
router.post('/addmsg', addMessage);
router.get('/getnotifies', getNotifies);

export default router;