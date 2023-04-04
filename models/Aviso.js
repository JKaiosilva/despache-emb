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
    avisoData: {
        type: String,
        default: []
    },
    data: {
        type: String
    },
    contentType: {
    type: String,
    required: true
  }
})

mongoose.model('avisos', Aviso)