const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Comboio = new Schema({
    usuarioId: {
        type: String
    },
    embarcacoes: [{
        
            type: Schema.Types.ObjectId,
            ref: 'Embarcacao',
        
        carga: {
            type: String
        },
        quantidade: {
            type: String
        },
        arqueacaoBruta: {
            type: String
        }
    }],
    comboioMesAnoAtual: {
        type: String,
        default: []
    }
})


mongoose.model('comboios', Comboio)