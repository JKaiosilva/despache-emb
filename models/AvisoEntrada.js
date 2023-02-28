const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AvisoEntrada = new Schema ({
    entradaNprocesso: {
        type: String,
        required: true
    },
    entradaPortoChegada: {
        type: String,
        required: true
    },
    entradaDataHoraChegada: {
        type: String,
        required: true
    },
    entradaPosicaoPortoAtual: {
        type: String,
        requried: true
    },
    entradaPortoOrigem: {
        type: String,
        required: true
    },
    entradaPortoDestino: {
        type: String,
        required: true
    },
    entradaDataHoraEstimadaSaida: {
        type: String,
        required: true
    },
    entradaNomeEmbarcacao: {
        type: String,
        required: true
    },
    entradaTipoEmbarcacao: {
        type: String,
        required: true
    },
    entradaBandeira: {
        type: String,
        required: true
    },
    entradaNInscricaoAutoridadeMaritima: {
        type: String,
        required: true
    },
    entradaArqueacaoBruta: {
        type: String,
        required: true
    },
    entradaTonelagemPorteBruto: {
        type: String,
        required: true
    },
    entradaNomeRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    entradaCPFCNPJRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    entradaTelefoneRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    entradaEnderecoRepresentanteEmbarcacao: {
        type: String,
        required: true
    },
    entradaEmailRepresentanteEmbarcacao: {
        type: String,
        requried: true
    },
    entradaDadosUltimaInpecaoNaval: {
        type: String,
        required: true
    },
    entradaDeficienciasRetificadasPorto: {
        type: String,
        required: true
    },
    entradaTransporteCagaPerigosa: {
        type: String,
        required: true
    },
    entradaObservacoes: {
        type: String,
        required: true
    },
    entradaTripulantes: {
        type: Array,
        arr: [{
            entradaTripulantesNome: String,
            entradaTripulantesGrauFuncao: String,
            entradaTripulantesDataNascimento: String,
            entradaTipulantesNCIR: String,
            entradaTripulantesValidadeCIR: String
        }]
    },
    entradaPassageiros: {
        type: Array,
        arr: [{
            entradaPassageirosNome: String,
            entradaPassageirosDataNascimento: String,
            entradaPassageirosSexo: String
        }]
    },
    entradaComboios: {
        type: Array,
        arr: [{
            entradaComboiosNome: String,
            entradaComboiosNIncricao: String,
            entradaComboiosArqueacaoBruta: String,
            entradaComboiosCarga: String,
            entradaComboiosQuantidadeCarga: String
        }]
    }




})

mongoose.model('avisoEntradas', AvisoEntrada)