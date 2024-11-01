import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import router from './router/index'

dotenv.config()

//Conexion a la BD
mongoose.Promise = global.Promise
const url_db= process.env.URL_DB;
mongoose.connect(url_db)
.then(mongoose=> console.log("Conectado a la DB"))
.catch(err => console.log(err))

const app = express()
const puerto = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log(`Recibida petición ${req.method} en ${req.path}`);
    next();
});


app.use('/api', router)
app.set('port', puerto)

app.listen(app.get('port'), ()=> {
    console.log(`EL SERVIDOR SE ESTA EJECUTANDO EN EL PUERTO ${puerto}`)
})