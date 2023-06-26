const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoEntrada = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },    
    entradaDespacho: {
        type: Schema.Types.ObjectId,
        ref: 'despachos'
    },
    entradaNprocesso: {
        type: String
    },
    entradaPortoChegada: {
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    entradaOutroPortoChegada: {
        type: String
    },
    entradaDataHoraChegada: {
        type: String
    },
    entradaPosicaoPortoAtual: {
        type: String
    },
    entradaPortoOrigem: {
        type: Schema.Types.Mixed,
        ref: 'portos'    
    },
    entradaOutroPortoOrigem: {
        type: String
    },
    entradaPortoDestino: {
        type: Schema.Types.Mixed,
        ref: 'portos' 
    },
    entradaOutroPortoDestino:{
        type: String
    },
    entradaDataHoraEstimadaSaida: {
        type: String
    },
    entradaNomeRepresentanteEmbarcacao: {
        type: String
    },
    entradaCPFCNPJRepresentanteEmbarcacao: {
        type: String
    },
    entradaTelefoneRepresentanteEmbarcacao: {
        type: String
    },
    entradaEnderecoRepresentanteEmbarcacao: {
        type: String
    },
    entradaEmailRepresentanteEmbarcacao: {
        type: String
    },
    entradaDadosUltimaInpecaoNaval: {
        type: String
    },
    entradaDeficienciasRetificadasPorto: {
        type: String
    },
    entradaTransporteCagaPerigosa: {
        type: String
    },
    entradaObservacoes: {
        type: String
    },
    entradaTripulantes: [{
        id: {
            type: Schema.Types.Mixed,
            ref: 'Tripulante',
        },
        entradaTripulanteFuncao: {

        }
    }],
    entradaPassageiros: [{
        nome: {
            type: String
        },
        dataNascimento: {
            type: String
        },
        sexo: {
            type: String
        }
    }],
    entradaComboios: {
        type: Schema.Types.ObjectId,
        ref: 'Comboio'
    },
    entradaDataPedido: {
        type: String,
        default: []
    },
    embarcacao: {
        type: Schema.Types.ObjectId,
        ref: 'embarcacoes'
    },
    entradaData: {
        type: Number,
        default: []
    },
    entradaMesAnoAtual: {
        type: String,
        default: []
    },
    entradaNovo: {
        type: Boolean
    }
})

mongoose.model('avisoEntradas', AvisoEntrada)