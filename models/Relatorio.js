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
    despachosCountMes: {
        type: Number
    },
    avisoEntradasCountMes: {
        type: Number
    },
    avisoSaidasCountCount: {
        type: Number
    },
    embarcacoesCountMes: {
        type: Number
    },
    avisosCountMes: {
        type: Number
    },
    usuariosCountMes: {
        type: Number 
    }
})


mongoose.model('relatorios', Relatorio)