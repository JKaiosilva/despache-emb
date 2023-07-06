const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Relatorio = new Schema ({
    usuarioID: {
        
    },
    mesEmbarcacaoInternacionalEmp: {
        type: String
    },
    mesEmbarcacaoBarcaca: {
        type: String
    },
    totalExtrangeiro: {
        type: String
    },
    mesEmbarcacaoRebocadorEmpurador: {
        type: String
    },
    mesEmbarcacaoBalsa: {
        type: String
    },
    mesEmbarcacaoCargaGeral: {
        type: String
    },
    mesEmbarcacaoDraga: {
        type: String
    },
    mesEmbarcacaoNacionalEmp: {
        type: String
    },
    mesEmbarcacaoLancha: {
        type: String
    },
    mesEmbarcacaoPassageiros: {
        type: String
    },
    totalNacional: {
        type: String
    },
    mesPassageiros: {
        type: String
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
        type: String,
        default: []
    },
    relatorioDataString: {
        type: String,
        default: []
    },
    mesDespachosCount: {
        type: String
    },
    mesAvisoEntradasCount: {
        type: String
    },
    mesAvisoSaidasCount: {
        type: String
    },
    mesEmbarcacoesCount: {
        type: String
    },
    mesAvisosCount: {
        type: String
    },
    mesUsuariosCount: {
        type: String 
    }
})


mongoose.model('relatorios', Relatorio)