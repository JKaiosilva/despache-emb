const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

require('../models/Aviso')
require('../models/Despacho')
require('../models/AvisoEntrada')
require('../models/AvisoSaida')
require('../models/Tripulante')
require('../models/Porto');
require('../models/Relatorio');
require('../models/Embarcacao')
require('../models/Comboio')
require('../models/Correcao')

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')
const Comboio = mongoose.model('comboios')
const Correcao = mongoose.model('correcoes')

const { Admin } = require('../helpers/eAdmin')
const { eUser } = require('../helpers/eUser')

const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


//-----     Rota para visualização de solicitação de correção       ----//


router.post('/addCorrecao', eUser, async(req, res) => {
    try{
        const novaCorrecao = {
            usuarioID: req.user._id,
            documentoReferente: req.body.documentId,
            conteudo: req.body.conteudoCorrecao,
            data: Date.now(),
            dataPedido: moment(Date.now()).format('DD/MM/YYYY'),
            revisado: false
        }
        new Correcao(novaCorrecao).save()
        req.flash('success_msg', 'Correção enviado com sucesso')
        res.redirect('/formulario')
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao enviar formulário de Despacho (${err})`)
        res.redirect('/formulario')
    }
})

module.exports = router