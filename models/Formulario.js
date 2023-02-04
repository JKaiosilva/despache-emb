const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment')




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
        type: String,
        default: []
    },
    idUsuario: {
        type: String,
        default: {}
    }
})

mongoose.model('formularios', Formulario)