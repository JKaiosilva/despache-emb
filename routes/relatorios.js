const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Usuario')
require('../models/Despacho')
require('../models/AvisoEntrada')
require('../models/AvisoSaida')
require('../models/Embarcacao')
require('../models/Aviso')
require('../models/Relatorio')
require('../models/Tripulante')

const Despacho = mongoose.model('despachos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Aviso = mongoose.model('avisos')
const Relatorio = mongoose.model('relatorios')
const Usuario = mongoose.model('usuarios')
const Tripulante = mongoose.model('tripulantes')

const pdf = require('html-pdf')
const transporter = require('../config/sendMail')
const moment = require('moment')
const {Admin} = require('../helpers/eAdmin')










module.exports = router