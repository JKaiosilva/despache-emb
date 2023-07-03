const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Despacho = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    agenciaID:{
        type: String
    },
    NprocessoDespacho: {
        type: String
    },
    despachoPortoEstadia: {
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    despachoOutroPortoEstadia: {
        type: String
    },
    despachoDataHoraPartida: {
        type: String
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
    despachoNomeRepresentanteEmbarcacao: {
        type: String
    },
    despachoCPFCNPJRepresentanteEmbarcacao: {
        type: String
    },
    despachoTelefoneRepresentanteEmbarcacao: {
        type: String
    },
    despachoEnderecoRepresentanteEmbarcacao: {
        type: String
    },
    despachoEmailRepresentanteEmbarcacao: {
        type: String
    },
    despachoDataUltimaInspecaoNaval: {
        type: String
    },
    despachoDeficiencias: {
        type: String  
    },
    despachoTransportaCargaPerigosa: {
        type: String  
    },
    despachoCertificadoTemporario90dias: {
        type: String  
    },
    despachoCasoDocumentoExpirado: {
        type: String
    },
    despachoOBS: {
        type: String
    },
    despachoNTripulantes: {
        type: String
    },
    despachoNomeComandante: {
        type: String
    },
    despachoTripulantes: [{
        id: {
            type: Schema.Types.Mixed,
            ref: 'Tripulante',
        },
        despachoTripulanteFuncao: {

        }
    }],
    despachoNomeEmbarcacao: {
        type: String
    },
    despachoNEmbN: {
        type: String
    },
    despachoComboios: [{
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
    despachoDataSolicitada:{
        type: String
    },
    despachoDataValidade: {
        type: String
    },
    despachoDataValidadeNumber: {
        type: String
    },
    despachoDataPedido: {
        type: String,
        default: []
    },
    despachoData: {
        type: Number,
        default: []
    },
    depachoMesAnoAtual: {
        type: String,
        default: []
    },
    despachoNovo: {
        type: Boolean
    }

})


mongoose.model('despachos', Despacho)