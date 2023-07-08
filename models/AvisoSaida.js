const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoSaida = new Schema({
    usuarioID: {
        type: String,
        default: {}
    },
    agenciaID:{
        type: String
    },
    agenciaNome: {
        type: String
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
    embarcacaoNome: {
        type: String
    },
    embarcacaoTipo: {
        type: String
    },
    embarcacaoBandeira: {
        type: String
    },
    embarcacaoNInscricaoautoridadeMB: {
        type: String
    },
    embarcacaoArqueacaoBruta: {
        type: String
    },
    embarcacaoComprimentoTotal: {
        type: String
    },
    embarcacaoTonelagemPorteBruto: {
        type: String
    },
    embarcacaoCertificadoRegistroAmador: {
        type: String
    },
    embarcacaoArmador: {
        type: String,
    },
    embarcacaoNCRA: {
        type: String
    },
    embarcacaoValidade: {
        type: String
    },
    embarcacaoValidadeNumber: {
        type: String
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
    saidaComboios: [{
        embarcacaoNome: {
            
        },
        NInscricao: {

        },
        carga: {
        },
        quantidade: {
        },
        arqueacaoBruta: {
        }
    }],
    saidaDataPedido: {
        type: String,
        default: []
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