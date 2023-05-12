const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Despacho = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    NprocessoDespacho: {
        type: String
    },
    despachoPortoEstadia: {
        type: Schema.Types.ObjectId,
        ref: 'portos'
    },
    despachoDataHoraPartida: {
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
        type: Schema.Types.ObjectId,
        ref: 'Tripulante'
    }],
    despachoNomeEmbarcacao: {
        type: String
    },
    despachoNEmbN: {
        type: String
    },
    despachoArqueacaoBrutaComboio: {
        type: String
    },
    despachoCarga: {
        type: String
    },
    despachoQuantidadeCaga: {
        type: String
    },
    despachoSomaArqueacaoBruta: {
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
    embarcacao: {
        type: Schema.Types.ObjectId,
        ref: 'embarcacoes'
    },
    depachoMesAnoAtual: {
        type: String,
        default: []
    }

})


mongoose.model('despachos', Despacho)