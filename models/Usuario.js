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
    oficial: {
        type: Number
    },
    eAdmin: {
        type: Number,
    },
    oficial:{
        type: Number
    },
    operador: {
        type: Number
    },
    eAgencia: {
        type: Number
    },
    eUser: {
        type: Number,
    },
    proprietario: {
        type: String
    },
    sociosProprietarios: {
        type: String
    },
    periodoContrato: {
        type: String
    },
    agencia: {
        type: String
    },
    senha: {
        type: String
    },
    dataCadastro: {
        type: String,
        default: []
    },
    usuarioMesAnoAtual: {
        type: String,
        default: []
    }
})

mongoose.model('usuarios', Usuario)