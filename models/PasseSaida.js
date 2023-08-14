const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PasseSaida = new Schema({
    UsuarioID:{

    },
    agenciaID: {

    },
    agenciaNome: {

    },
    NProcessoDespacho: {

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

})


mongoose.model('passeSaidas', PasseSaida)