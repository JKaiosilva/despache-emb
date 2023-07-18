const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Correcao = new Schema({
    usuarioID:{
        type: String
    },
    documentoReferente: {
        type: Schema.Types.Mixed
    },
    conteudo: {
        type: String
    },
    dataPedido: {
        default: []
    }
})


mongoose.model('correcoes', Correcao)