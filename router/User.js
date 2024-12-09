import routerx from 'express-promise-router'
import userController from '../controllers/UserController'
import multiparty from 'connect-multiparty'

var path = multiparty({uploadDir: './uploads/user'})

const router = routerx()
//prueba
router.get("/all", userController.getUsers)

router.get("/list", path, userController.listUsers)
router.post("/register", userController.register)
router.post("/update", path, userController.update)
router.delete("/delete/:id", path, userController.remove)
router.get("/imagen-usuario/:img", userController.getImagen)

router.post("/login", userController.login)

//ADMIN
router.post("/register-admin", path, userController.register_admin)
router.post("/login-admin", userController.login_admin)


export default router