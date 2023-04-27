const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Embarcacao = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    embarcacaoNome: {
        type: String,
        required: true
    },
    embarcacaoTipo: {
        type: String,
        required: true
    },
    embarcacaoBandeira: {
        type: String,
        required: true
    },
    embarcacaoNInscricaoautoridadeMB: {
        type: String,
        required: true
    },
    embarcacaoArqueacaoBruta: {
        type: String,
        required: true
    },
    embarcacaoComprimentoTotal: {
        type: String,
        required: true
    },
    embarcacaoTonelagemPorteBruto: {
        type: String,
        required: true
    },
    embarcacaoCertificadoRegistroAmador: {
        type: String,
        required: true
    },
    embarcacaoArmador: {
        type: String,
        required: true
    },
    embarcacaoNCRA: {
        type: String,
        required: true
    },
    embarcacaoValidade: {
        type: String,
        required: true
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