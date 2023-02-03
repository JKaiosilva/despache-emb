const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Medicao = new Schema({
    nomeCidade: {
        type: String,
        require: false
    },
    nivelCidade: {
        type: String,
        require: false
    },
    dataAtu: {
        type: String,
        require: false
    },
    nomeAgencia: {
        type: String,
        require: false
    }

})

mongoose.model('medicaos', Medicao)