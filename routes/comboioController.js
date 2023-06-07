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


router.get('/formulario/comboio', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        res.render('formulario/comboios/comboios', {
            embarcacoes: embarcacoes
        })
    }catch(err){
        res.flash('error_msg', 'Error interno ao mostrar pagina')
        res.redirect('/')
    }
})


router.post('/formulario/comboios', eUser, async(req, res) => {
    try{
        const carga = req.body.comboiosCarga
        const quantidade = req.body.comboiosQuantidadeCarga
        const arqueacaoBruta = req.body.comboiosarqueacaoBruta

        const cleanString = req.body.embarcacoes.replace(/[\n' \[\]]/g, '');
        const embarcacoes = cleanString.split(',');


        const comboioEmbarcacoes = {}
        comboioEmbarcacoes.id = embarcacoes.map((id) => mongoose.Types.ObjectId(id));
        comboioEmbarcacoes.carga = carga
        comboioEmbarcacoes.quantidade = quantidade
        comboioEmbarcacoes.arqueacaoBruta = arqueacaoBruta

        const novoComboio = {
            usuarioId: req.user._id,
            embarcacoes: comboioEmbarcacoes, 
            comboioMesAnoAtual: Date.now()
            
        }
        new Comboio(novoComboio).save()
        req.flash('success_msg', 'Comboio formulado com sucesso!')
        res.redirect('/')

    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Error interno ao mostrar pagina')
        res.redirect('/')
    }
})




module.exports = router