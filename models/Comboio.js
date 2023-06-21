const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Comboio = new Schema({
    usuarioId: {
        type: String
    },
    comboioNome: {
        type: String
    },
    embarcacoes: [{
        id: {
            type: Schema.Types.Mixed,
            ref: 'Embarcacao',
        },
        embarcacaoNome: {
        },
        carga: {
        },
        quantidade: {
        },
        arqueacaoBruta: {
        }
    }],
    comboioMesAnoAtual: {
        type: String,
        default: []
    },
    comboioNovo: {
        type: Boolean
    }
})


mongoose.model('comboios', Comboio)