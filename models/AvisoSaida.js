const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoSaida = new Schema({
    usuarioID: {
        type: String,
        default: {}
    },
    saidaNprocesso: {

    },
    saidaPortoSaida: {
        type: Schema.Types.ObjectId,
        ref: 'portos'
    },
    saidaDataHoraSaida: {

    },
    saidaPortoDestino: {

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
        type: Schema.Types.ObjectId,
        ref: 'Tripulante'
    }],
    saidaPassageiros: {
        type: Array,
        arr: [{
            saidaPassageirosNome: String,
            saidaPassageirosDataNascimento: String,
            saidaPassageirosSexo: String
        }]
    },
    saidaComboios: {
        type: Array,
        arr: [{
            saidaComboiosNome: String,
            saidaComboiosNIncricao: String,
            saidaComboiosArqueacaoBruta: String,
            saidaComboiosCarga: String,
            saidaComboiosQuantidadeCarga: String
        }]
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
    }

})


mongoose.model('avisoSaidas', AvisoSaida)