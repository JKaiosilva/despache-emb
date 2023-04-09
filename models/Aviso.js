const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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

/* Você encontrou a terceira flag: lilaz */

mongoose.model('avisos', Aviso)