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
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    despachoOutroPortoEstadia: {
        type: String
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
    despachoComboios: {
        type: Schema.Types.ObjectId,
        ref: 'Comboio'
    },
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
    embarcacao: {
        type: Schema.Types.ObjectId,
        ref: 'embarcacoes'
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