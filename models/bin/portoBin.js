const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PortoBin = new Schema({
    usuarioID: {
        type: String
    },
    portoNome: {
        type: String
    },
    positionX: {
        type: String
    },
    positionZ: {
        type: String
    }
})

mongoose.model('portosBin', PortoBin)