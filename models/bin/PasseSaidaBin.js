const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PasseSaidaBin = new Schema({
    UsuarioID:{

    },
    agenciaID: {

    },
    agenciaNome: {

    },
    NprocessoDespacho: {

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

    },
    deletadoPor: {

    },
    deletadoEm: {
        
    }
})


mongoose.model('passeSaidasBin', PasseSaidaBin)