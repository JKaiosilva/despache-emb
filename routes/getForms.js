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



router.get('/formulario', async (req, res) => {
    try{
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({EmbarcacaoNome: 'asc'})
        const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
        const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
        const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
        
            res.render('formulario/preform', 
            {despachos: despachos, 
                avisoEntradas: avisoEntradas, 
                    avisoSaidas: avisoSaidas, 
                        embarcacoes: embarcacoes
            })
    }catch(err){
        req.flash('error_msg', 'Não foi possivel mostrar os formularios')
        res.redirect('/')
    }
})

router.get('/pages/sobrenos', (req, res) => {
    res.render('pages/sobrenos')
})

router.get('/pages/termosUso', (req, res) => {
    res.render('pages/termosUso')
})

router.get('/formulario/avisoSaida', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
        res.render('formulario/saidas/avisoSaida', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})

router.get('/formulario/avisoEntrada', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) =>{
        res.render('formulario/entradas/avisoEntrada', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})

router.get('/formulario/despacho', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
        res.render('formulario/despachos/despacho', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})


router.get('/formulario/addEmbarcacao', (req, res) => {
    res.render('formulario/embarcacoes/addEmbarcacao')
})

router.get('/formulario/addTripulante', (req, res) => {
    res.render('formulario/tripulantes/addTripulante')
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

router.get('/embarcacoes',  (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({EmbarcacaoNome: 'asc'}).then((embarcacoes) => {
        res.render('formulario/embarcacoes/embarcacoes', {embarcacoes: embarcacoes})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    })
})

router.get('/embarcacoes/:page', async (req, res) => {
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


router.get('/entradas', async (req, res) => {
    try{
        const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
        res.render('formulario/entradas/entradas', 
            {avisoEntradas: avisoEntradas,
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/entradas/:page', async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
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
                                hidden: hidden
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})


router.get('/saidas', async (req, res) => {
    try{
        const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
            res.render('formulario/saidas/saidas', 
                {avisoSaidas: avisoSaidas
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/saidas/:page', async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
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
                                hidden: hidden
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})


router.get('/despachos', async (req, res) => {
    try{
        const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            res.render('formulario/despachos/despachos', 
                {despachos: despachos
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/despachos/:page', async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
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
                                hidden: hidden
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})



router.get('/embarcacoesDespacho/:id', async (req, res) => {
    const embarcacaoId = await req.params._id;

    try{
        const despachos = await Despacho.find({embarcacaoId: embarcacoes._id}).limit(5).lean().sort({despachoDataPedido: 'asc'})
        res.render('formulario/despachos/embarcacoesDespacho', 
            {despachos: despachos})
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})




module.exports = router