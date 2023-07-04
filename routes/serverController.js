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


//----    Rota do Painel admin     ----//


router.get('/admin/painel', Admin, async (req, res) => {
    try {
        const API_KEY = process.env.API_KEY

        var usuariosOperador = await Usuario.find({ _id: req.user._id }).lean();

        tempo = {}

        const openweathermap = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=-19.0092&lon=-57.6533&units=metric&appid=${API_KEY}`)
        .then((response)=> {
            tempo.data = response.data
        }).catch((err)=>{
            if (err) {
                console.log('Erro de conexão com a API OpenWeatherMap');
                tempo.data = null;
            } else {
                throw err;
            }
        })


        const medidaRio = {};

        const RioParaguai = await axios.get('https://www.marinha.mil.br/chn-6/')
        .then(({data}) => {
                const $ = cheerio.load(data);
    
                $('.table-responsive table tbody').each((i, elem) => {
                    var medida_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-altura"]').last().text().replace('\n            ', '').replace('          ', '');
                    medidaRio.data = medida_ladario;
                });
        }).catch((err)=> {
            if (err.code === 'ENOTFOUND') {
                console.log('Erro de conexão com a API OpenWeatherMap');
                medidaRio.data = null;
            } else {
                throw err;
            }
        })

        const dataHoje = moment(Date.now()).format('DD/MM/YYYY HH:mm');

        var avisos = await Aviso.find().count();
        var usuarios = await Usuario.find().count();
        var embarcacoes = await Embarcacao.find().count();
        var despachos = await Despacho.find().count();
        var avisoEntradas = await AvisoEntrada.find().count();
        var avisoSaidas = await AvisoSaida.find().count();
        var tripulantes = await Tripulante.find().count()
        var relatorios = await Relatorio.find().count()
        var portos = await Porto.find().count()

            res.render('admin/painel', {
                avisos: avisos,
                usuariosOperador: usuariosOperador,
                usuarios: usuarios,
                embarcacoes: embarcacoes,
                despachos: despachos,
                avisoEntradas: avisoEntradas,
                avisoSaidas: avisoSaidas,
                tripulantes: tripulantes,
                relatorios: relatorios,
                portos: portos,
                tempo: tempo,
                medidaRio: medidaRio,
                dataHoje: dataHoje
            });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', `Erro ao mostrar Painel Administrativo (${err})`);
        res.redirect('/');
    }
});


//----    Rota da página de informações da plataforma     ----//

router.get('/pages/sobrenos', async (req, res) => {
    try{
        res.render('pages/sobrenos')
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar página (${err})`)
        res.redirect('/')
    }
})


//----     Rota dos termos de Uso    ----//


router.get('/pages/termosUso', async (req, res) => {
    try{
        res.render('pages/termosUso')
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar termos de uso (${err})`)
        res.redirect('/')
    }
})


//----    Rota da paginação dos avisos    ----//


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
                        {
                            avisos: avisos, 
                            nextPage: nextPage, 
                            previousPage: previousPage,
                            hidden: hidden
                        })
        } catch (err) {
            req.flash('error_msg', `Erro ao paginar avisos (${err})`)
            res.redirect('/')
        }
})


//----     Rota de visualização de Aviso     ----//


router.get('/aviso/:id', async(req, res) => {
    try{
        const aviso = await Aviso.findOne({_id: req.params.id}).lean()
        res.render('pages/avisoVizu', 
            {
                aviso: aviso
            })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar aviso (${err})`)
        res.redirect('/')
    }
})


//----    Rota do painel de Formulários do usuário    ----//


router.get('/formulario', async (req, res) => {
    try{

        const despachante = req.user.eUser
        const agencia = req.user.eAgencia

        const dataHoje = Date.now()

        if(agencia == 1){
        
            const despachos = await Despacho.find({agenciaID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            const avisoEntradas = await AvisoEntrada.find({agenciaID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
            const avisoSaidas = await AvisoSaida.find({agenciaID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
            const usuarios = await Usuario.find({agencia: req.user._id}).limit(5).lean()

            console.log('agencia')
            agenciaHidden = 'hidden'
            res.render('formulario/preform', 
            {
                despachos: despachos, 
                avisoEntradas: avisoEntradas,
                usuarios: usuarios, 
                avisoSaidas: avisoSaidas, 
                agenciaHidden: agenciaHidden
            })

        }else if(despachante == 1){
            const despachosValid = await Despacho.find({agenciaID: req.user.agencia, despachoDataValidadeNumber: {$gte: dataHoje}}).lean()
        
            const despachos = await Despacho.find({agenciaID: req.user.agencia}).limit(5).lean().sort({despachoData: 'desc'})
            const avisoEntradas = await AvisoEntrada.find({agenciaID: req.user.agencia}).limit(5).lean().sort({entradaData: 'desc'})
            const avisoSaidas = await AvisoSaida.find({agenciaID: req.user.agencia}).limit(5).lean().sort({saidaData: 'desc'})
    
            if(despachosValid){
                console.log('encontrou um valido')
                docHidden = ''
                alertHidden = 'hidden'
            }else{
                console.log('não encontrou valido')
                docHidden = 'hidden'
                alertHidden = ''
            }
            console.log('despachante')

            despachanteHidden = 'hidden'

            res.render('formulario/preform', 
            {
                despachos: despachos, 
                avisoEntradas: avisoEntradas, 
                avisoSaidas: avisoSaidas,
                despachanteHidden: despachanteHidden, 
                alertHidden: alertHidden,
                docHidden: docHidden,                
            })
        }else{
            const despachosValid = await Despacho.find({usuarioID: req.user._id}).lean().sort({despachoData: 'desc'})
        
            const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
            const avisoSaidas = await AvisoSaida.find({usuarioID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
    
            if(!despachosValid.find(el => el.despachoDataValidadeNumber > dataHoje)){
                docHidden = 'hidden'
                alertHidden = ''
            }else{
                docHidden = ''
                alertHidden = 'hidden'
            }
            console.log('admin')

            res.render('formulario/preform', 
            {
                despachos: despachos, 
                avisoEntradas: avisoEntradas, 
                avisoSaidas: avisoSaidas, 
                alertHidden: alertHidden,
                docHidden: docHidden,                
            })
 }
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de Formulário (${err})`)
        res.redirect('/')
    }
})


//----     Rota de educação Fluvial     ----//


router.get('/edFluvial', async(req, res) => {
    try{
        res.render('pages/edFluvial')
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar página de Educação Fluvial (${err})`)
        res.redirect('/')
    }
})


module.exports = router