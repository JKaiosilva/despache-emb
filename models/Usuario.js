const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    CPF: {
        type: Number,
        require: true
    },
    euser: {
        type: Number,
        default: 1
    },
    senha: {
        type: String,
        require: true
    }
})

mongoose.model('usuarios', Usuario)