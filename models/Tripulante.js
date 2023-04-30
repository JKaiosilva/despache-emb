const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tripulante = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    tripulanteNome: {
        type: String,
        required: true
    },
    tripulanteGrau: {
        type: String,
        required: true
    },
    tripulanteDataNascimento: {
        type: String,
        required: true
    },
    tripulanteNCIR: {
        type: String,
        required: true
    },
    tripulanteValidadeCIR: {
        type: String,
        required: true
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