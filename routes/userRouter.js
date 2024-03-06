import express from 'express'
import UserController from '../controllers/userController.js'
import verify_auth from '../middlewares/auth-middleware.js'

const router = express.Router()



//public routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/sendPasswordResetEmail', UserController.sendPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.resetPassword)

//private routes
router.post('/changepassword',verify_auth, UserController.changePassword)
router.get('/loggeduser',verify_auth, UserController.loggeduser)

export default router