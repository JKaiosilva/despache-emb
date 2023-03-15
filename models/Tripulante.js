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
        required: tue
    },
    tripulanteValidadeCIR: {
        type: String,
        required: true
    }
})

mongoose.model('tripulantes', Tripulante)