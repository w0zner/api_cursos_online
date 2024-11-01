import jwt from 'jsonwebtoken'
import models from '../models'
import * as dotenv from 'dotenv'
dotenv.config()

const enconde= async (_id, rol, email) => {
    const payload = {_id: _id, rol: rol, email: email}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'});

    return token;
}

const decode= async (token) => {
    try {
        const {_id}= await jwt.verify(token, process.env.SECRET_KEY)
        const user= await models.User.findOne({_id: _id})

        if(user) {
            return user
        }
        return false;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export default {
    enconde,
    decode
}