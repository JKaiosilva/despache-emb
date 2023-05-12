const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Embarcacao = new Schema ({
    usuarioID: {
        type: String,
        default: {}
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
        type: String
    },
    embarcacaoNCRA: {
        type: String
    },
    embarcacaoValidade: {
        type: String
    },
    embarcacaoDataCadastro: {
        type: String,
        default: []
    },
    embarcacaoData: {
        type: Number,
        default: []
    },
    embarcacaoMesAnoAtual: {
        type: String,
        default: []
    }

})

mongoose.model('embarcacoes', Embarcacao)