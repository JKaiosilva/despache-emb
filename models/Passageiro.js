const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Passageiro = new Schema({
    nome:{
        type: String
    },
    dataNascimento: {
        type: String
    },
    sexo: {
        type: String
    }
})

mongoose.model('passageiros', Passageiro)