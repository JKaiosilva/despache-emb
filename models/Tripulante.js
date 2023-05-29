const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tripulante = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    tripulanteNome: {
        type: String
    },
    tripulanteGrau: {
        type: String
    },
    tripulanteDataNascimento: {
        type: String
    },
    tripulanteNCIR: {
        type: String
    },
    tripulanteValidadeCIR: {
        type: String
    },
    tripulanteValidadeCIRNumber: {
        type: String
    },
    tripulanteDataCadastro: {
        type: String
    },
    tripulanteDataNumber: {
        type: Number
    },
    tripulanteMesAnoAtual: {
        type: String
    }
})

mongoose.model('tripulantes', Tripulante)