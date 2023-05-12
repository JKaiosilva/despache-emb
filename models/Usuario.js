const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String
    },
    email: {
        type: String
    },
    CPF: {
        type: Number
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
        type: String
    },
    dataCadastro: {
        type: Number,
        default: []
    },
    usuarioMesAnoAtual: {
        type: String,
        default: []
    }
})

mongoose.model('usuarios', Usuario)