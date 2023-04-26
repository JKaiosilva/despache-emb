const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Despacho = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    NprocessoDespacho: {
        type: String,
        required: true
    },
    despachoPortoEstadia: {
        type: String,
        required: true
    },
    despachoDataHoraPartida: {
        type: String,
        required: true
    },
    despachoNomeRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    despachoCPFCNPJRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    despachoTelefoneRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    despachoEnderecoRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    despachoEmailRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    despachoDataUltimaInspecaoNaval: {
        type: String,
        required: true
    },
    despachoDeficiencias: {
        type: String,
        required: true  
    },
    despachoTransportaCargaPerigosa: {
        type: String,
        required: true  
    },
    despachoCertificadoTemporario90dias: {
        type: String,
        required: true  
    },
    despachoCasoDocumentoExpirado: {
        type: String,
        required: false
    },
    despachoOBS: {
        type: String,
        required: false
    },
    despachoNTripulantes: {
        type: String,
        required: true
    },
    despachoNomeComandante: {
        type: String,
        required: true
    },
    despachoTripulantes: {
        type: Array,
        arr: [{despachoTripulantesNome: String, 
            despachoTripulantesGrau: String, 
            despachoTripulantesDataNascimento: String,
            despachoTripulantesNCIR: String,
            despachoTripulantesValidadeCIR: String}]
    },
    despachoNomeEmbarcacao: {
        type: String,
        required: true
    },
    despachoNEmbN: {
        type: String,
        required: true
    },
    despachoArqueacaoBrutaComboio: {
        type: String,
        required: true
    },
    despachoCarga: {
        type: String,
        required: true
    },
    despachoQuantidadeCaga: {
        type: String,
        required: true
    },
    despachoSomaArqueacaoBruta: {
        type: String,
        required: true
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
        ref: 'embarcacoes',
        required: true
    },
    depachoMesAtual: {
        type: Number,
        default: []
    }

})


mongoose.model('despachos', Despacho)