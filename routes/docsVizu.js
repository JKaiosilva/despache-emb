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




router.get('/formulario/despachoVizu/:id', (req, res) => {
    Despacho.findOne({_id: req.params.id}).lean().then((despachos) => {   
        Embarcacao.findOne({_id: despachos.embarcacao}).lean().then((embarcacoes) => {
            res.render('formulario/despachos/despachoVizu', 
            {despachos: despachos, 
                embarcacoes: embarcacoes
            })
        })                 
    }).catch((err) => {
        res.redirect('/')
    })
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



router.get('/formulario/avisoEntradaVizu/:id', (req, res) => {
    AvisoEntrada.findOne({_id: req.params.id}).lean().then((avisoEntradas) => {  
        Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean().then((embarcacoes) => {
            res.render('formulario/entradas/avisoEntradaVizu', 
            {avisoEntradas: avisoEntradas, 
                embarcacoes: embarcacoes
            })
        })                  
    }).catch((err) => {
        res.redirect('/')
    })
})

router.get('/formulario/avisoSaidaVizu/:id', (req, res) => {
    AvisoSaida.findOne({_id: req.params.id}).lean().then((avisoSaidas) => {
        Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean().then((embarcacoes) => {
            res.render('formulario/saidas/avisoSaidaVizu', 
            {avisoSaidas: avisoSaidas, 
                embarcacoes: embarcacoes
            })
        })                  
    }).catch((err) => {
        res.redirect('/')
    })
})


module.exports = router