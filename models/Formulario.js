const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const app = express()

const Formulario = new Schema({
    nome: {
        type: String,
        require: true
    },
    codigo: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    dsaida: {
        type: String,
        require: true
    },
    dvolta: {
        type: String,
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    },
    CPF: {
        type: Number,
        require: true
    }
})

mongoose.model('formularios', Formulario)