const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Porto = new Schema({
    usuarioID: {
        type: String,
        required: true
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

mongoose.model('portos', Porto)