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



router.get('/formulario/embarcacaoVizu/:id', eUser, async(req, res) => {
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


router.get('/formulario/despachoVizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const despachos = await Despacho.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: despachos.despachoTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: despachos.embarcacao}).lean()
        const portos = await Porto.findOne({_id: despachos.despachoPortoEstadia}).lean()
            res.render('formulario/despachos/despachoVizu',
                {despachos: despachos,
                    tripulantes: tripulantes,
                        embarcacoes: embarcacoes,
                            portos: portos,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


router.get('/formulario/avisoEntradavizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const avisoEntradas = await AvisoEntrada.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: avisoEntradas.entradaTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean()
        const portos = await Porto.findOne({_id: avisoEntradas.entradaPortoChegada}).lean()

            res.render('formulario/entradas/avisoEntradaVizu',
                {avisoEntradas: avisoEntradas,
                    tripulantes: tripulantes,
                        embarcacoes: embarcacoes,
                            portos: portos,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


router.get('/formulario/avisoSaidaVizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const avisoSaidas = await AvisoSaida.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: avisoSaidas.saidaTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean()
        const portos = await Porto.findOne({_id: avisoSaidas.saidaPortoSaida}).lean()

            res.render('formulario/saidas/avisoSaidaVizu',
                {avisoSaidas: avisoSaidas,
                    embarcacoes: embarcacoes,
                        tripulantes: tripulantes,
                            portos: portos,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})



module.exports = router