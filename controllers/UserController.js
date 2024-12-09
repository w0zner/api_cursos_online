import models from "../models"
import bcrypt from "bcryptjs"
import token from "../services/token"
import fs from 'fs'
import path from 'path'

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
            msg: "Error inesperado al listar usuarios",
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

const getImagen = (req, res) => {
    try {
        var img  = req.params["img"]
        if(!img){
            res.status(500).send({
                message: 'Error inesperado al obtener la imagen'
            })
        } else {
            fs.stat('./uploads/user/' + img, function(error) {
                if(!error) {
                    let path_img = './uploads/user/' + img
                    res.status(200).sendFile(path.resolve(path_img))
                } else {
                    let path_img = './uploads/default.jpg'
                    res.status(200).sendFile(path.resolve(path_img))
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error inesperado' })
    }
}

const update =  async(req, res) => {
    try {

        const { email } = req.body.email
        console.log(email)

        const user_exist= await models.User.findOne({email: req.body.email, _id: {$ne: req.body._id}})

        if(user_exist) {
            res.status(403).json({
                msg: "Ya existe un usuario registrado con el email: " + req.body.email
            })
        }

        if(req.body.password) {
            //Encriptación de contraseña
            req.body.password= await bcrypt.hash(req.body.password, 10);
        }
        
        if(req.files && req.files.avatar) {
            var img_path = req.files.avatar.path
            var name = img_path.split("\\")
            var avatar_name = name[2]
            req.name.avatar = avatar_name
        }

        const User = await models.User.findByIdAndUpdate({_id: req.body._id}, req.body)    
        res.status(200).json({
            msg: "Registro actualizado   exitosamente",
            user: User
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({ message: 'Error inesperado' })
    }
}

const listUsers = async(req, res)=> {
    try {
        const search = req.query.search

        let USERS = await models.User.find({
            $or: [
                {'name': new RegExp(search, 'i')},
                {'surname': new RegExp(search, 'i')},
                {'email': new RegExp(search, 'i')}
            ]
        }).sort({'createdAt': -1})

        res.status(200).json(
            {users: USERS}
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado al listar usuarios",
        })
    }
}

const remove = async (req, res) => {
    try {
        const _id= req.params["id"]

        const  User= await models.User.findByIdAndDelete({_id: _id})
        
        res.status(200).json({message: "Usuario eliminado correctamente."})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado al eliminar usuarios",
        })
    }
}

export default {
    getUsers,
    register,
    login,
    login_admin,
    register_admin,
    getImagen,
    update,
    listUsers,
    remove
}