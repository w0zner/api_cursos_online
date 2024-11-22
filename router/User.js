import routerx from 'express-promise-router'
import userController from '../controllers/UserController'

const router = routerx()

router.get("/all", userController.getUsers)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/login-admin", userController.login_admin)

export default router