const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
    },
    email: {
    },
    CPF: {
    },
    oficial: {
    },
    eAdmin: {
    },
    oficial:{
    },
    operador: {
    },
    eAgencia: {
    },
    eUser: {
    },
    perm: {

    },
    proprietario: {
    },
    sociosProprietarios: [{
    }],
    periodoContrato: {
    },
    agencia: {
    },
    senha: {
    },
    dataCadastro: {
        default: []
    },
    usuarioMesAnoAtual: {
        default: []
    }
})

mongoose.model('usuarios', Usuario)