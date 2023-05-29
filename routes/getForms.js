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
const moment = require('moment')


router.get('/formulario', eUser, async (req, res) => {
    try{
        const dataHoje = Date.now()

        const embarcacoesValid = await Embarcacao.find({usuarioID: req.user._id}).lean().sort({EmbarcacaoNome: 'asc'})
        const despachosValid = await Despacho.find({usuarioID: req.user._id}).lean().sort({despachoData: 'desc'})

        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({EmbarcacaoNome: 'asc'})
        const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
        const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
        const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
        
        if(!embarcacoesValid.find(el => el.embarcacaoValidadeNumber > dataHoje)){
            hidden = 'hidden'
            alertHidden = ''
            docHidden = 'hidden'
        }else if(!despachosValid.find(el => el.despachoDataValidadeNumber > dataHoje)){
            hidden = ''
            docHidden = 'hidden'
            alertHidden = ''
        }else{
            hidden = ''
            docHidden = ''
            alertHidden = 'hidden'
        }
            res.render('formulario/preform', 
            {despachos: despachos, 
                avisoEntradas: avisoEntradas, 
                    avisoSaidas: avisoSaidas, 
                        embarcacoes: embarcacoes,
                            hidden: hidden,
                                alertHidden: alertHidden,
                                    docHidden: docHidden,
                                        
            })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Não foi possivel mostrar os formularios')
        res.redirect('/')
    }
})


router.get('/pages/sobrenos', async (req, res) => {
    try{
        res.render('pages/sobrenos')
    }catch(err){
        req.flash('error_msg', 'Erro interno')
        res.redirect('/')
    }
})


router.get('/pages/termosUso', async (req, res) => {
    try{
        res.render('pages/termosUso')
    }catch(err){
        req.flash('error_msg', 'Erro interno')
        res.redirect('/')
    }
})


router.get('/formulario/avisoSaida', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()
            res.render('formulario/saidas/avisoSaida',
                {embarcacoes: embarcacoes,
                    tripulantes: tripulantes,
                        portos: portos
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})


router.get('/formulario/avisoEntrada', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const despachos = await Despacho.find({usuarioID: req.user._id, despachoDataValidadeNumber: {$gte: dataHoje}}).lean()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()

            res.render('formulario/entradas/avisoEntrada', 
                {embarcacoes: embarcacoes,
                    tripulantes: tripulantes,
                        portos: portos,
                            despachos: despachos
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})


router.get('/formulario/despacho', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()
        res.render('formulario/despachos/despacho', 
            {embarcacoes: embarcacoes,
                tripulantes: tripulantes,
                    portos: portos 
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})



router.get('/formulario/addEmbarcacao', eUser, async (req, res) => {
    try{
        res.render('formulario/embarcacoes/addEmbarcacao')
    }catch(err){
        req.flash('error_msg', 'Erro interno')
        res.redirect('/')
    }
})



router.get('/page/:page', async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
        try {
            const contagem = await Aviso.count()
                if(parseInt(page) * limit >= contagem){
                    nextPage = ''
                    hidden = 'hidden'
                }else{
                    nextPage = `/page/${parseInt(page) + 1}`
                    hidden = ''
                }

                if(parseInt(page) == 2){
                    previousPage = '/'
                }else {
                    previousPage = `/page/${parseInt(page) -1}`
                }

                const avisos = await Aviso.find().skip(skip).limit(limit).lean().sort({data: 'desc'})
                    res.render('pages/page', 
                        {avisos: avisos, 
                            nextPage: nextPage, 
                                previousPage: previousPage,
                                    hidden: hidden

                            })
        } catch (err) {
    }
})


router.get('/embarcacoes', eUser, async (req, res) => {
    try{
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({EmbarcacaoNome: 'asc'})
            res.render('formulario/embarcacoes/embarcacoes', 
                {embarcacoes: embarcacoes
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})

router.get('/embarcacoes/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
     try{
        const contagem = await Embarcacao.count()
        if(parseInt(page) * limit >= contagem){
            nextPage = ''
            hidden = 'hidden'
        }else{
            nextPage = parseInt(page) + 1
            hidden = ''
        }

        if(parseInt(page) == 2){
            previousPage = ''
        }else{
            previousPage = parseInt(page) - 1
        }
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({EmbarcacaoNome: 'asc'})
            res.render('formulario/embarcacoes/embarcacoesPage', 
                {embarcacoes: embarcacoes,
                    nextPage: nextPage,
                        previousPage: previousPage,
                            hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
     }
})


router.get('/entradas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true:false;
    try{
        const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
        res.render('formulario/entradas/entradas', 
            {avisoEntradas: avisoEntradas,
                admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/entradas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await AvisoEntrada.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1
            }
            const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({entradaData: 'desc'})
                res.render('formulario/entradas/entradasPage', 
                    {avisoEntradas: avisoEntradas,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden,
                                    admin: admin
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})


router.get('/saidas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try{
        const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
            res.render('formulario/saidas/saidas', 
                {avisoSaidas: avisoSaidas,
                    admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/saidas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await AvisoSaida.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1
            }
            const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({saidaData: 'desc'})
                res.render('formulario/saidas/saidasPage', 
                    {avisoSaidas: avisoSaidas,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden,
                                    admin: admin
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})


router.get('/despachos', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try{
        const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            res.render('formulario/despachos/despachos', 
                {despachos: despachos,
                    admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/despachos/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await Despacho.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1
            }
            const despachos = await Despacho.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({despachoData: 'desc'})
                res.render('formulario/despachos/despachosPage', 
                    {despachos: despachos,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden,
                                    admin: admin
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})




module.exports = router