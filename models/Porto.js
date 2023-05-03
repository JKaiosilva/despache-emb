const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Porto = new Schema({
    usuarioID: {
        type: String,
        required: true
    }
})

mongoose.model('portos', Porto)