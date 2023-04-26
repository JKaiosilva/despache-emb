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
    eAdmin: {
        type: Boolean,
        default: false
    },
    eUser: {
        type: Number,
        default: 1
    },
    senha: {
        type: String,
        require: true
    },
    dataCadastro: {
        type: Number,
        default: []
    },
    usuarioMesAtual: {
        type: Number,
        default: []
    }
})

mongoose.model('usuarios', Usuario)