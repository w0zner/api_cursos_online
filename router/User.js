import routerx from 'express-promise-router'
import userController from '../controllers/UserController'
import multiparty from 'connect-multiparty'

var path = multiparty({uploadDir: './uploads/user'})

const router = routerx()

router.get("/all", userController.getUsers)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/login-admin", userController.login_admin)

//ADMIN
router.post("/register-admin", path, userController.register_admin)

export default router