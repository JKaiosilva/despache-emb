const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoEntrada = new Schema ({
    usuarioID: {
        type: String,
        default: {}
    },
    agenciaID:{
        type: String
    },
    agenciaNome: {
        type: String
    },
    entradaDespacho: {
        type: Schema.Types.ObjectId,
        ref: 'despachos'
    },
    entradaNprocesso: {
        type: String
    },
    entradaPortoChegada: {
        type: Schema.Types.Mixed,
        ref: 'portos'
    },
    entradaOutroPortoChegada: {
        type: String
    },
    entradaDataHoraChegada: {
        type: String
    },
    entradaPosicaoPortoAtual: {
        type: String
    },
    entradaPortoOrigem: {
        type: Schema.Types.Mixed,
        ref: 'portos'    
    },
    entradaOutroPortoOrigem: {
        type: String
    },
    entradaPortoDestino: {
        type: Schema.Types.Mixed,
        ref: 'portos' 
    },
    entradaOutroPortoDestino:{
        type: String
    },
    entradaDataHoraEstimadaSaida: {
        type: String
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
        type: String,
    },
    embarcacaoNCRA: {
        type: String
    },
    embarcacaoValidade: {
        type: String
    },
    embarcacaoValidadeNumber: {
        type: String
    },
    entradaNomeRepresentanteEmbarcacao: {
        type: String
    },
    entradaCPFCNPJRepresentanteEmbarcacao: {
        type: String
    },
    entradaTelefoneRepresentanteEmbarcacao: {
        type: String
    },
    entradaEnderecoRepresentanteEmbarcacao: {
        type: String
    },
    entradaEmailRepresentanteEmbarcacao: {
        type: String
    },
    entradaDadosUltimaInpecaoNaval: {
        type: String
    },
    entradaDeficienciasRetificadasPorto: {
        type: String
    },
    entradaTransporteCagaPerigosa: {
        type: String
    },
    entradaObservacoes: {
        type: String
    },
    entradaTripulantes: [{
        id: {

        },
        entradaTripulanteFuncao: {

        }
    }],
    entradaPassageiros: [{
        nome: {
            type: String
        },
        dataNascimento: {
            type: String
        },
        sexo: {
            type: String
        }
    }],
    entradaComboios: [{
        embarcacaoNome: {
        },
        NInscricao: {

        },
        carga: {
        },
        quantidade: {
        },
        arqueacaoBruta: {
        }
    }],
    entradaDataPedido: {
        type: String,
        default: []
    },
    entradaData: {
        type: Number,
        default: []
    },
    entradaMesAnoAtual: {
        type: String,
        default: []
    },
    entradaNovo: {
        type: Boolean
    },
    entradaNaoEditado: {
        type: Number
    },
})

mongoose.model('avisoEntradas', AvisoEntrada)