const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Correcao = new Schema({
    usuarioID:{
        type: String
    },
    documentoReferente: {
        type: Schema.Types.ObjectId
    },
    conteudo: {
        type: String
    },
    dataPedido: {
        default: []
    },
    revisado: {
        type: Boolean
    }
})


mongoose.model('correcoes', Correcao)