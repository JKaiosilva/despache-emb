const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoBin = new Schema({
    titulo: {
        type: String
    },
    descricao: {
        type: String
    },
    conteudo: {
        type: String
    },
    avisoData: {
        type: String,
        default: []
    },
    data: {
        type: String
    },
    contentType: {
        type: String
    },
    avisoMesAnoAtual: {
        type: String,
        default: []
    }
})


mongoose.model('avisosBin', AvisoBin)