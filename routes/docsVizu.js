const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')
require('../models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')
require('../models/AvisoSaida')
const AvisoSaida = mongoose.model('avisoSaidas')
require('../models/Embarcacao')
const Embarcacao = mongoose.model('embarcacoes')
require('../models/Aviso')
const Aviso = mongoose.model('avisos')
const pdf = require('html-pdf')



router.get('/formulario/embarcacaoVizu/:id', async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const embarcacoes = await Embarcacao.findOne({_id: req.params.id}).lean()
        const despachos = await Despacho.find({embarcacao: embarcacoes._id}).lean()
        const avisoEntradas = await AvisoEntrada.find({embarcacao: embarcacoes._id}).lean()
        const avisoSaidas = await AvisoSaida.find({embarcacao: embarcacoes._id}).lean()
            res.render('formulario/embarcacoes/embarcacaoVizu',
                {embarcacoes: embarcacoes,
                    despachos: despachos,
                        avisoEntradas: avisoEntradas,
                            avisoSaidas: avisoSaidas,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar Embarcação')
        res.redirect('/')
    }
})







router.get('/formulario/despachoVizu/:id', async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const despachos = await Despacho.findOne({_id: req.params.id}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: despachos.embarcacao}).lean()
            res.render('formulario/despachos/despachoVizu',
                {despachos: despachos,
                    embarcacoes: embarcacoes,
                        hidden: hidden
                })
    }catch(err){

    }
})


router.get('/formulario/avisoEntradavizu/:id', async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        avisoEntradas = await AvisoEntrada.findOne({_id: req.params.id}).lean()
        embarcacoes = await Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean()
        res.render('formulario/entradas/avisoEntradaVizu',
            {avisoEntradas: avisoEntradas,
                embarcacoes: embarcacoes,
                    hidden: hidden
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


router.get('/formulario/avisoSaidaVizu/:id', async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        avisoSaidas = await AvisoSaida.findOne({_id: req.params.id}).lean()
        embarcacoes = await Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean()
        res.render('formulario/saidas/avisoSaidaVizu',
            {avisoSaidas: avisoSaidas,
                embarcacoes: embarcacoes,
                    hidden: hidden
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


module.exports = router