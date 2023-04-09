const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const eUser = require('../helpers/eUser')
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


router.get('/formulario', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().sort({embarcacaoDataCadastro: 'asc'}).then((embarcacoes) => {
        Despacho.find({usuarioID: req.user._id}).lean().sort({despachoDataPedido: 'asc'}).then((despachos) => {
            AvisoEntrada.find({usuarioID: req.user._id}).lean().sort({entradaDataPedido: 'desc'}).then((avisoEntradas) => {
                AvisoSaida.find({usuarioID: req.user._id}).lean().sort({saidaDataPedido: 'asc'}).then((avisoSaidas) => {
                    res.render('formulario/preform', 
                        {despachos: despachos, 
                            avisoEntradas: avisoEntradas, 
                                avisoSaidas: avisoSaidas, 
                                    embarcacoes: embarcacoes
                        })
                })
            })
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possivel mostrar os formularios')
        res.redirect('/')
    })
   
})

router.get('/sobrenos', (req, res) => {
    res.render('pages/sobrenos')
})

router.get('/termosUso', (req, res) => {
    res.render('pages/termosUso')
})

router.get('/formulario/avisoSaida', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
        res.render('formulario/avisoSaida', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})

router.get('/formulario/avisoEntrada', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) =>{
        res.render('formulario/avisoEntrada', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})

router.get('/formulario/despacho', (req, res) => {
    Embarcacao.find({usuarioID: req.user._id}).lean().then((embarcacoes) => {
        res.render('formulario/despacho', 
            {embarcacoes: embarcacoes
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    })
})


router.get('/formulario/addEmbarcacao', (req, res) => {
    res.render('formulario/addEmbarcacao')
})

router.get('/addTripulante', (req, res) => {
    res.render('formulario/addTripulante')
})


router.get('/formulario/embarcacaoVizu/:id', (req, res) => {
    Embarcacao.findOne({_id: req.params.id}).lean().then((embarcacoes) => {
        Despacho.find({embarcacao: embarcacoes._id}).lean().then((despachos) => {
            AvisoEntrada.find({embarcacao: embarcacoes._id}).lean().then((avisoEntradas) => {
                AvisoSaida.find({embarcacao: embarcacoes._id}).lean().then((avisoSaidas) => {
                    res.render('formulario/embarcacaoVizu', 
                        {embarcacoes: embarcacoes, 
                            despachos: despachos, 
                                avisoEntradas: avisoEntradas, 
                                avisoSaidas: avisoSaidas
                        })
                })
            })
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar Embarcação')
        res.redirect('/')
    })
})

router.get('/formulario/despachoVizu/:id', (req, res) => {
    Despacho.findOne({_id: req.params.id}).lean().then((despachos) => {   
        Embarcacao.findOne({_id: despachos.embarcacao}).lean().then((embarcacoes) => {
            res.render('formulario/despachoVizu', 
            {despachos: despachos, 
                embarcacoes: embarcacoes
            })
        })                 
    }).catch((err) => {
        res.redirect('/')
    })
})

router.get('/formulario/avisoEntradaVizu/:id', (req, res) => {
    AvisoEntrada.findOne({_id: req.params.id}).lean().then((avisoEntradas) => {  
        Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean().then((embarcacoes) => {
            res.render('formulario/avisoEntradaVizu', 
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
            res.render('formulario/avisoSaidaVizu', 
            {avisoSaidas: avisoSaidas, 
                embarcacoes: embarcacoes
            })
        })                  
    }).catch((err) => {
        res.redirect('/')
    })
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

module.exports = router