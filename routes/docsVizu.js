const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Usuario')
require('../models/Despacho')
require('../models/AvisoEntrada')
require('../models/AvisoSaida')
require('../models/Embarcacao')
require('../models/Aviso')
require('../models/Tripulante')
require('../models/Porto')

const Despacho = mongoose.model('despachos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Aviso = mongoose.model('avisos')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')

const {eUser} = require('../helpers/eUser')
const pdf = require('html-pdf')
















module.exports = router