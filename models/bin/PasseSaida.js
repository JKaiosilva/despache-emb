const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PasseSaidaBin = new Schema({
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
    deletadoPor: {

    },
    deletadoEm: {
        
    }
})


mongoose.model('passeSaidasBin', PasseSaidaBin)