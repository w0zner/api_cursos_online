import models from "../models"
import bcrypt from "bcryptjs"
import token from "../services/token"

const register = async(req, res)=> {
    try {

        const { email } = req.body.email
        console.log(email)

        const user_exist= await models.User.findOne({email: req.body.email})

        if(user_exist) {
            res.status(403).json({
                msg: "Ya existe un usuario registrado con el email " + req.body.email
            })
        }

        //Encriptación de contraseña
        req.body.password= await bcrypt.hash(req.body.password, 10);

        /* const newUser = new models.User()
        newUser.rol= req.body.rol
        newUser.name= req.body.name
        newUser.email= req.body.email
        newUser.save() */

        const User = await models.User.create(req.body)    
        res.status(200).json({
            msg: "Registro guardado exitosamente",
            user: User
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado en user.register",
        })
    }
}

const login= async(req, res)=> {
    try {
        const {email, password} = req.body
        const user= await models.User.findOne({email: email, state: 1});

        if(user) {
            let compare = await bcrypt.compare(password, user.password);
            if(compare) {
                let tokenT = await token.enconde(user._id, user.rol, user.email);

                const user_body = {
                    token: tokenT,
                    user: {
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        //avatar: user.avatar
                    }
                }

                res.status(200).json({
                    user: user_body
                })
            } else {
                res.status(404).json({
                    msg: "Usuario o contraseña no válido.",
                }) 
            }
        } else {
            res.status(404).json({
                msg: "Usuario o contraseña no válido.",
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado en user.login",
        })
    }
}

const login_admin= async(req, res)=> {
    try {
        const {email, password} = req.body
        const user= await models.User.findOne({email: email, state: 1, rol: 'ADMIN'});

        if(user) {
            let compare = await bcrypt.compare(password, user.password);
            if(compare) {
                let tokenT = await token.enconde(user._id, user.rol, user.email);

                const user_body = {
                    token: tokenT,
                    user: {
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        //avatar: user.avatar
                    }
                }

                res.status(200).json({
                    user: user_body
                })
            } else {
                res.status(404).json({
                    msg: "Usuario o contraseña no válido.",
                }) 
            }
        } else {
            res.status(404).json({
                msg: "Usuario o contraseña no válido.",
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado en user.login",
        })
    }
}

const getUsers = async(req, res)=> {
    try {
        const {nombre} = req.body
        res.status(200).json({
            msg: "Hola " + nombre,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado en user.getUsers",
        })
    }
}

const register_admin = async(req, res) => {
    try {

        const { email } = req.body.email
        console.log(email)

        const user_exist= await models.User.findOne({email: req.body.email})

        if(user_exist) {
            res.status(403).json({
                msg: "Ya existe un usuario registrado con el email: " + req.body.email
            })
        }

        //Encriptación de contraseña
        req.body.password= await bcrypt.hash(req.body.password, 10);

        if(req.files && req.files.avatar) {
            var img_path = req.files.avatar.path
            var name = img_path.split("\\")
            var avatar_name = name[2]
            req.name.avatar = avatar_name
        }

        const User = await models.User.create(req.body)    
        res.status(200).json({
            msg: "Registro guardado exitosamente",
            user: User
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({ message: 'Error inesperado' })
    }
}

export default {
    getUsers,
    register,
    login,
    login_admin
}