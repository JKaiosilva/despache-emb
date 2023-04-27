const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Relatorio = new Schema ({
    usuarioID: {
        
    },
    mesEmbarcacaoInternacionalEmp: {
        type: Number
    },
    mesEmbarcacaoBarcaca: {
        type: Number
    },
    totalExtrangeiro: {
        type: Number
    },
    mesEmbarcacaoRebocadorEmpurador: {
        type: Number
    },
    mesEmbarcacaoBalsa: {
        type: Number
    },
    mesEmbarcacaoCargaGeral: {
        type: Number
    },
    mesEmbarcacaoDraga: {
        type: Number
    },
    mesEmbarcacaoNacionalEmp: {
        type: Number
    },
    mesEmbarcacaoLancha: {
        type: Number
    },
    mesEmbarcacaoPassageiros: {
        type: Number
    },
    totalNacional: {
        type: Number
    },
    mesPassageiros: {
        type: Number
    },
    mesAnoAtual: {
        type: String,
        default: []
    },
    mesAtualString: {
        type: String,
        default: []
    },
    relatorioDataNumber: {
        type: Number,
        default: []
    },
    relatorioDataString: {
        type: String,
        default: []
    },
    mesDespachosCount: {
        type: Number
    },
    mesAvisoEntradasCount: {
        type: Number
    },
    mesAvisoSaidasCount: {
        type: Number
    },
    mesEmbarcacoesCount: {
        type: Number
    },
    mesAvisosCount: {
        type: Number
    },
    mesUsuariosCount: {
        type: Number 
    }
})


mongoose.model('relatorios', Relatorio)