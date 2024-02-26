const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PasseSaida = new Schema({
    UsuarioID:{

    },
    agenciaID: {

    },
    agenciaNome: {

    },
    NprocessoDespacho: {

    },
    despachoId:{

    },
    embarcacaoNome: {

    },
    embarcacaoBandeira: {

    },
    embarcacaoComandante: {

    },
    CFM: {

    },
    validade: {

    },
    destino: {

    },
    date: {

    }

})


mongoose.model('passeSaidas', PasseSaida)