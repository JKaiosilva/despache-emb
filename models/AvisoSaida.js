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
    saidaTripulantes: {
        type: Array,
        arr: [{
            saidaTripulantesNome: String,
            saidaTripulantesGrauFuncao: String,
            saidaTripulantesDataNascimento: String,
            saidaTipulantesNCIR: String,
            saidaTripulantesValidadeCIR: String
        }]
    },
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
        ref: 'embarcacoes',
        required: true
    },
    saidaData: {
        type: Number,
        default: []
    }

})


mongoose.model('avisoSaidas', AvisoSaida)