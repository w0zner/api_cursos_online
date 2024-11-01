import token from './token'


const verificarPermisosTienda= async (req, res, next) => {
    const tokenAuth = req.headers.token
    if(!tokenAuth){
        res.status(400).json({
            msg: "No se pudo obtener el token, verifique sus datos"
        })
    }

    const response= await token.decode(tokenAuth);
    if(response) {
        if(response.rol == "CLIENTE" || response.rol == "ADMIN") {
            next()
        } else {
            res.status(403).json({
                msg: "Acceso denegado a esta página"
            })
        }
    } else {
        res.status(403).json({
            msg: "El token es inválido."
        })
    }
}

const verificarPermisosAdmin= async (req, res, next) => {
    const tokenAuth = req.headers.token
    if(!tokenAuth){
        res.status(400).json({
            msg: "No se pudo obtener el token, verifique sus datos"
        })
    }

    const response= await token.decode(tokenAuth);
    if(response) {
        if(response.rol == "ADMIN") {
            next()
        } else {
            res.status(403).json({
                msg: "Acceso denegado a esta página"
            })
        }
    } else {
        res.status(403).json({
            msg: "El token es inválido."
        })
    }
}


export default {
    verificarPermisosTienda,
    verificarPermisosAdmin
}