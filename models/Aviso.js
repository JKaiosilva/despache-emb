const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Aviso = new Schema({
    titulo: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    },
    data: {
        type: String,
        default: []
    },
    img: {
        data: Buffer,
        contentType: String
    }
})

mongoose.model('avisos', Aviso)