import { Router } from 'express'
import { AppControllers } from '../controllers/AppControllers.js'
export const router = Router()

router.post('/login', AppControllers.login)
router.post('/register', AppControllers.register)
router.get('/getTasks/:username', AppControllers.getTasks)
router.delete('/deleteTask/:id', AppControllers.deleteTask)
router.put('/checkTask/:id', AppControllers.checkTask)
router.put('/uncheckTask/:id', AppControllers.uncheckTask)
router.post('/createTask', AppControllers.addTask)