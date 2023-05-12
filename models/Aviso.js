const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Aviso = new Schema({
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


mongoose.model('avisos', Aviso)