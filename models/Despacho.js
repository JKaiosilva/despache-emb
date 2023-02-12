const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Despacho = new Schema ({
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
    despachoNomeEmbarcação: {
        type: String,
        required: true
    },
    despachoTipoEmbarcacao: {
        type: String,
        required: true
    },
    despachoBandeira: {
        type: String,
        required: true
    },
    despachoNInscricaoautoridadeM: {
        type: String,
        required: true
    },
    despachoArqueacaoBruta: {
        type: String,
        required: true
    },
    despachoComprimentoTotal: {
        type: String,
        required: true
    },
    despachoTonelagemPorteBruto: {
        type: String,
        required: true
    },
    despachoCertificadoRegistroAmador: {
        type: String,
        required: true
    },
    despachoArmador: {
        type: String,
        required: true
    },
    despacgoNCRA: {
        type: String,
        required: true
    },
    despachoValidade: {
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
        type: Boolean,
        required: false
    },
    despachoTransportaCargaPerigosa: {
        type: Boolean,
        required: false
    },
    despachoCertificadoTemporario90dias: {
        type: Boolean,
        required: false
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
    }

})


mongoose.model('despachos', Despacho)