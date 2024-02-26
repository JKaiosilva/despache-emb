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
require('../models/PasseSaida')

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
const PasseSaida = mongoose.model('passeSaidas')


const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')
const {eOficial, eAdmin, eOperador, eAgencia, eDespachante} = require('../helpers/perms/permHash')
const notifiCheck = require('../helpers/conds/notificacaoAdmin');


//----    Rota do Painel admin     ----//


router.get('/admin/painel', eOperador, async (req, res) => {
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
        const notificado = await notifiCheck();
        const medidaRio = {};

        const RioParaguai = await axios.get('https://www.marinha.mil.br/chn-6/')
        .then(({data}) => {
                const $ = cheerio.load(data);
    
                $('.table-responsive table tbody').each((i, elem) => {
                    var medida_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-altura"]').last().text().replace('\n            ', '').replace('          ', '');
                    medidaRio.data = medida_ladario;
                });
        }).catch((err)=> {
            if (err) {
                console.log('Erro de conexão com a API OpenWeatherMap');
                medidaRio.data = null;
            } else {
                throw err;
            }
        })

        operadorHidden = ''
        oficialHidden = ''
        if(req.user.oficial == 1){
            oficialHidden = 'hidden'
        }
        if(req.user.operador == 1){
            operadorHidden = 'hidden'
        }

        const dataHoje = moment(Date.now()).format('DD/MM/YYYY HH:mm');

        var oficiais = await Usuario.find({oficial: 1}).count()
        var operadores = await Usuario.find({operador: 1}).count()
        var avisos = await Aviso.find().count();
        var usuarios = await Usuario.find({eAgencia: 1}).count();
        var despachos = await Despacho.find().count();
        var avisoEntradas = await AvisoEntrada.find().count();
        var avisoSaidas = await AvisoSaida.find().count();
        var tripulantes = await Tripulante.find().count()
        var relatorios = await Relatorio.find().count()
        var portos = await Porto.find().count()
        var passeSaidas = await PasseSaida.find().count()

            res.render('admin/painel', {
                avisos: avisos,
                usuariosOperador: usuariosOperador,
                usuarios: usuarios,
                despachos: despachos,
                avisoEntradas: avisoEntradas,
                avisoSaidas: avisoSaidas,
                tripulantes: tripulantes,
                relatorios: relatorios,
                portos: portos,
                tempo: tempo,
                medidaRio: medidaRio,
                dataHoje: dataHoje,
                operadorHidden: operadorHidden,
                oficialHidden: oficialHidden,
                oficiais: oficiais,
                operadores: operadores,
                passeSaidas: passeSaidas,
                notificado: notificado
            });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', `Erro ao mostrar Painel Administrativo (${err})`);
        res.redirect('/');
    }
});



router.get('/admin/contagemDocs', eOperador, async(req, res) => {
    try{
        const despachos = await Despacho.find({despachoNaoEditado: 1}).count();
        res.json(despachos);
    }catch(err){
        console.log(err)
    }
})

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


router.get('/formulario', eDespachante, async (req, res) => {
    try{

        const despachante = req.user.eUser
        const eAgencia = req.user.eAgencia

        const dataHoje = Date.now()

        if(eAgencia == 1){
        
            const despachos = await Despacho.find({agenciaID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            const avisoEntradas = await AvisoEntrada.find({agenciaID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
            const avisoSaidas = await AvisoSaida.find({agenciaID: req.user._id}).limit(5).lean().sort({saidaData: 'desc'})
            const usuarios = await Usuario.find({agencia: req.user.id}).limit(5).lean().sort({nome: 'desc'})
            const passeSaidas = await PasseSaida.find({agenciaID: req.user.id}).limit(5).lean().sort({date: 'desc'})
            console.log(usuarios, passeSaidas)
            for await(const passeSaida of passeSaidas){
                passeSaida.dataValidade = moment(parseInt(passeSaida.validade)).format('DD/MM/YYYY');
                if(passeSaida.validade >= Date.now()){
                    passeSaida.condicao = 1;
                    passeSaida.editado = 'Validado';
                }else{
                    passeSaida.condicao = 1;
                    passeSaida.editado = 'Não validado';
                }
            }


            for await(const despacho of despachos){
                despacho.despachoDataValidade = moment(parseInt(despacho.despachoDataValidadeNumber)).format('DD/MM/YYYY')

                if(despacho.despachoNaoEditado == 0 && despacho.despachoDataValidadeNumber >= Date.now()){
                    despacho.condicao = 1;
                    despacho.editado = 'Validado';
                }else if(despacho.despachoNaoEditado == 1){
                    despacho.condicao = 2;
                    despacho.editado = 'Em análise';
                }else{
                    despacho.condicao = 3
                    despacho.editado = 'Não validado';
                }   
            }

            for await(const avisoEntrada of avisoEntradas){
                avisoEntrada.entradaDataValidade = moment(parseInt(avisoEntrada.entradaDataValidadeNumber)).format('DD/MM/YYYY');
                if(avisoEntrada.entradaDataValidadeNumber >= Date.now()){
                    avisoEntrada.condicao = 1;
                    avisoEntrada.editado = 'Validado'
                }else{
                    avisoEntrada.condicao = 3
                    avisoEntrada.editado = 'Não validado'
                }
 
            }

            for await(const avisoSaida of avisoSaidas){
                avisoSaida.saidaDataValidade = moment(parseInt(avisoSaida.saidaDataValidadeNumber)).format('DD/MM/YYYY');
                if(avisoSaida.saidaDataValidadeNumber >= Date.now()){
                    avisoSaida.condicao = 1;
                    avisoSaida.editado = 'Validado'

                }else{
                    avisoSaida.condicao = 3
                    avisoSaida.editado = 'Não validado'

                }
            }



            agenciaHidden = 'hidden'
            res.render('formulario/preform', 
            {
                despachos: despachos, 
                avisoEntradas: avisoEntradas,
                usuarios: usuarios, 
                avisoSaidas: avisoSaidas, 
                agenciaHidden: agenciaHidden,
                passeSaidas: passeSaidas
            })

        }else if(despachante == 1){
            const despachosValid = await Despacho.find({agenciaID: req.user.agencia}).lean()
        
            const despachos = await Despacho.find({agenciaID: req.user.agencia}).limit(5).lean().sort({despachoData: 'desc'})
            const avisoEntradas = await AvisoEntrada.find({agenciaID: req.user.agencia}).limit(5).lean().sort({entradaData: 'desc'})
            const avisoSaidas = await AvisoSaida.find({agenciaID: req.user.agencia}).limit(5).lean().sort({saidaData: 'desc'})
            const passeSaidas = await PasseSaida.find({agenciaID: req.user.agencia}).limit(5).lean()

            for await(const passeSaida of passeSaidas){
                passeSaida.dataValidade = moment(parseInt(passeSaida.validade)).format('DD/MM/YYYY');

                if(passeSaida.validade >= Date.now()){
                    passeSaida.condicao = 1;
                    passeSaida.editado = 'Validado';
                }else{
                    passeSaida.condicao = 1;
                    passeSaida.editado = 'Não validado';
                }
            }
            
            
            for await(const despacho of despachos){
                despacho.despachoDataValidade = moment(parseInt(despacho.despachoDataValidadeNumber)).format('DD/MM/YYYY')

                if(despacho.despachoNaoEditado == 0 && despacho.despachoDataValidadeNumber >= Date.now()){
                    despacho.condicao = 1;
                    despacho.editado = 'Validado';
                }else if(despacho.despachoNaoEditado == 1){
                    despacho.condicao = 2;
                    despacho.editado = 'Em análise';
                }else{
                    despacho.condicao = 3
                    despacho.editado = 'Não validado';
                }   
            }

            for await(const avisoEntrada of avisoEntradas){
                avisoEntrada.entradaDataValidade = moment(parseInt(avisoEntrada.entradaDataValidadeNumber)).format('DD/MM/YYYY');
                if(avisoEntrada.entradaDataValidadeNumber >= Date.now()){
                    avisoEntrada.condicao = 1;
                    avisoEntrada.editado = 'Validado'
                }else{
                    avisoEntrada.condicao = 3
                    avisoEntrada.editado = 'Não validado'

                }
            }
            
            for await(const avisoSaida of avisoSaidas){
                avisoSaida.saidaDataValidade = moment(parseInt(avisoSaida.saidaDataValidadeNumber)).format('DD/MM/YYYY');
                if(avisoSaida.saidaDataValidadeNumber >= Date.now()){
                    avisoSaida.condicao = 1;
                    avisoSaida.editado = 'Validado'
                }else{
                    avisoSaida.condicao = 3
                    avisoSaida.editado = 'Não validado'
                }
            }

            if(despachosValid.find((el) => el.despachoDataValidadeNumber > dataHoje)){
                docHidden = ''
                alertHidden = 'hidden'
            }else{
                docHidden = 'hidden'
                alertHidden = ''
            }
            const periodoContrato = Date.parse(req.user.periodoContrato)
            blockHidden = ''
            if(periodoContrato < dataHoje){
                blockHidden = 'hidden'
            }
            
            despachanteHidden = 'hidden'

            res.render('formulario/preform', 
            {
                despachos: despachos, 
                avisoEntradas: avisoEntradas, 
                avisoSaidas: avisoSaidas,
                despachanteHidden: despachanteHidden, 
                alertHidden: alertHidden,
                docHidden: docHidden,
                blockHidden: blockHidden,
                passeSaidas: passeSaidas                
            })
        }else{
            req.flash('error_msg', 'Acesso não autorizado');
            res.redirect('/');
 }
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de Formulário (${err})`)
        res.redirect('/')
    }
})


module.exports = router