const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Relatorio = new Schema ({
    usuarioID: {
        
    },
    somaEmbarcacaoInternacionalEmp: {
        type: Number
    },
    somaEmbarcacaoBarcaca: {
        type: Number
    },
    totalExtrangeiro: {
        type: Number
    },
    somaEmbarcacaoRebocadorEmpurador: {
        type: Number
    },
    somaEmbarcacaoBalsa: {
        type: Number
    },
    somaEmbarcacaoCargaGeral: {
        type: Number
    },
    somaEmbarcacaoDraga: {
        type: Number
    },
    somaEmbarcacaoNacionalEmp: {
        type: Number
    },
    somaEmbarcacaoLancha: {
        type: Number
    },
    somaEmbarcacaoPassageiros: {
        type: Number
    },
    totalNacional: {
        type: Number
    },
    somaPassageiros: {
        type: Number
    },
    mesAtual: {
        type: Number,
        default: []
    },
    relatorioDataNumber: {
        type: Number,
        default: []
    },
    relatorioDataString: {
        type: String,
        default: []
    }
})


mongoose.model('relatorios', Relatorio)