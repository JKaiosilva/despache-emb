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
        type: Schema.Types.ObjectId,
        ref: 'portos'
    },
    entradaDataHoraChegada: {
        type: String
    },
    entradaPosicaoPortoAtual: {
        type: String
    },
    entradaPortoOrigem: {
        type: String
    },
    entradaPortoDestino: {
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
        type: Schema.Types.ObjectId,
        ref: 'Tripulante'
    }],
    entradaPassageiros: {
        type: Array,
        arr: [{
            entradaPassageirosNome: String,
            entradaPassageirosDataNascimento: String,
            entradaPassageirosSexo: String
        }]
    },
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
    }
})

mongoose.model('avisoEntradas', AvisoEntrada)