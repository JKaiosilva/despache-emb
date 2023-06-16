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

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')

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



router.get('/admin/portos', Admin, async (req, res) => {
    try {
        const portos = await Porto.find().lean().sort({ portoNome: 'asc' })
        res.render('admin/portos/portos',
            {
                portos: portos
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno.')
        res.redirect('painel')
    }
})


router.get('/admin/addPorto', Admin, async (req, res) => {
    try {
        res.render('admin/portos/addPorto')
    } catch (err) {
        req.flash('error_msg', 'Erro interno.')
        res.redirect('painel')
    }
})

router.post('/admin/addPorto', Admin, async (req, res) => {
    try {
        const novoPorto = {
            usuarioID: req.user._id,
            portoNome: req.body.portoNome,
            positionX: req.body.positionX,
            positionZ: req.body.positionZ
        }
        await new Porto(novoPorto).save()
        req.flash('success_msg', 'Porto cadastrado com sucesso!')
        res.redirect('painel')
    } catch (err) {
        req.flash('error_msg', 'Erro ao cadastrar porto.')
        res.redirect('painel')
    }
})


router.get('/admin/portoVizu/:id', Admin, async(req, res) => {
    try{
        const dataHoje = moment(Date.now()).format('YYYY-MM-DD')
        const portos = await Porto.findOne({_id: req.params.id}).lean()
        const despachos = await Despacho.find({despachoPortoEstadia: portos._id, }).lean()
        const avisoSaidas = await AvisoSaida.find({saidaDataHoraSaida: dataHoje}).lean()

        for await(var saida of avisoSaidas){
            var embarcacoes = await Embarcacao.findById(saida.embarcacao).lean()
            saida.embarcacao = embarcacoes.embarcacaoNome
        }


         for await(var despacho of despachos){
            var embarcacoes = await Embarcacao.findById(despacho.embarcacao).lean()
            despacho.embarcacao = embarcacoes.embarcacaoNome
        }


            res.render('admin/portos/portoVizu', 
                {portos: portos,
                    despachos: despachos,
                        avisoSaidas: avisoSaidas
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar porto.')
        res.redirect('portos')
    }
})


router.get('/admin/portoEdit/:id', Admin, async(req, res) => {
    try{
        const portos = await Porto.findOne({_id: req.params.id}).lean()
        res.render('admin/portos/portoEdit', 
        {
            portos: portos
        })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao mostrar porto.')
        res.redirect('portos')
    }
})


router.post('/admin/portoEdit', Admin, async(req, res) => {
    try{

    }catch(err){

    }
})


router.get('/portoInfo', Admin, async (req, res) => {
    try {
        const dataHoje = moment(Date.now()).format('YYYY-MM-DD')
        const despachos = await Despacho.find({ depachoMesAnoAtual: dataHoje }).lean()
        const avisoSaidas = await AvisoSaida.find({saidaDataHoraSaida: dataHoje}).lean()
        const avisoEntradas = await AvisoEntrada.find({ entradaMesAnoAtual: dataHoje }).lean()
        var portos = [];

        for await (const saida of avisoSaidas) {
            var portoEmb = {}
            var procurar = await Embarcacao.findOne({ _id: saida.embarcacao }).lean()
            if(procurar.embarcacaoTipo != 'barcaça'){
                portoEmb = { nome: procurar.embarcacaoNome, id: procurar._id.toString(), portoEstadia: saida.saidaPortoSaida.toString() }
            }else{
                portoEmb = { nomeBarcaca: procurar.embarcacaoNome, id: procurar._id.toString(), portoEstadia: saida.saidaPortoSaida.toString() }
            }
            

            var porto = await Porto.findOne({ _id: portoEmb.portoEstadia }).lean()
            porto.embarcacaoNome = portoEmb.nome 
            porto.barcaca = portoEmb.nomeBarcaca
            porto.embarcacaoId = portoEmb.id
            if (portos.some(portoLocal => portoLocal.portoNome == porto.portoNome)) {
                const portoLocal = portos.find(portoLocal => portoLocal.portoNome == porto.portoNome)
                portoLocal.embarcacaoNome.push(porto.embarcacaoNome)
                portoLocal.barcaca.push(porto.barcaca)
                portoLocal.embarcacaoId.push(porto.embarcacaoId)
            } else {
                portos.push({ ...porto, embarcacaoNome: [porto.embarcacaoNome], barcaca: [porto.barcaca], embarcacaoId: [porto.embarcacaoId] })
            }
        }

        const data = portos
        res.json(data)
    } catch (err) {

    }
}) 

module.exports = router