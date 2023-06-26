const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoSaida = new Schema({
    usuarioID: {
        type: String,
        default: {}
    },
    saidaDespacho:{
        type: Schema.Types.ObjectId,
        ref: 'despachos'
    },
    saidaNprocesso: {

    },
    saidaPortoSaida: {
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    saidaOutroPortoSaida: {
        type: String
    },
    saidaDataHoraSaida: {

    },
    saidaPortoDestino: {
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    saidaOutroPortoDestino: {
        type: String
    },
    saidaDataHoraChegada: {

    },
    saidaNomeRepresentanteEmbarcacao: {

    },
    saidaCPFCNPJRepresentanteEmbarcacao: {

    },
    saidaTelefoneRepresentanteEmbarcacao: {

    },
    saidaEnderecoRepresentanteEmbarcacao: {

    },
    saidaEmailRepresentanteEmbarcacao: {

    },
    saidaObservacoes: {

    },
    saidaSomaPassageiros: {

    },
    saidaTripulantes: [{
        id: {
            type: Schema.Types.Mixed,
            ref: 'Tripulante',
        },
        saidaTripulanteFuncao: {

        }
    }],
    saidaPassageiros: [{
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
    saidaComboios: {
        type: Schema.Types.ObjectId,
        ref: 'Comboio'
    },
    saidaDataPedido: {
        type: String,
        default: []
    },
    embarcacao: {
        type: Schema.Types.ObjectId,
        ref: 'embarcacoes'
    },
    saidaData: {
        type: Number,
        default: []
    },
    saidaMesAnoAtual: {
        type: String,
        default: []
    },
    saidaNovo: {
        type: Boolean
    }

})


mongoose.model('avisoSaidas', AvisoSaida)