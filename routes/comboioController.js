/*

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

const { Admin } = require('../helpers/perms/eAdmin')
const { eUser } = require('../helpers/perms/euser')

const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


//----  Rota para formulário de adição de Comboio    ----//


router.get('/formulario/comboio', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        res.render('formulario/comboios/comboio', {
            embarcacoes: embarcacoes
        })
    }catch(err){
        res.flash('error_msg', `Erro ao mostrar página de adição de Comboio (${err})`)
        res.redirect('/formulario')
    }
})


//----  Rota para postagem de Comboio   ----//


router.post('/formulario/comboio', eUser, async (req, res) => {
    try {
        const cleanString = req.body.embarcacoes.replace(/[\n' \[\]]/g, '');
        const embs = cleanString.split(',');

        const comboioEmbarcacoes = [];
    
        if(embs.length === 1){
            for (var i = 0; i < embs.length; i++) {
                async function pesquisarNome(id){
                const embarcacao = await Embarcacao.findOne({_id: id}).lean()
                return embarcacao.embarcacaoNome
                }
                const comboioEmbarcacao = {
                id: req.body.comboio,
                embarcacaoNome: await pesquisarNome(req.body.comboio),
                carga: req.body.comboiosCarga,
                quantidade: req.body.comboiosQuantidadeCarga,
                arqueacaoBruta: req.body.comboiosarqueacaoBruta
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }else{
            for (var i = 0; i < embs.length; i++) {
                async function pesquisarNome(id){
                const embarcacao = await Embarcacao.findOne({_id: id}).lean()
                return embarcacao.embarcacaoNome
                }
                const comboioEmbarcacao = {
                id: req.body.comboio[i],
                embarcacaoNome: await pesquisarNome(req.body.comboio[i]),
                carga: req.body.comboiosCarga[i],
                quantidade: req.body.comboiosQuantidadeCarga[i],
                arqueacaoBruta: req.body.comboiosarqueacaoBruta[i]
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }
    
        const novoComboio = new Comboio({
            usuarioId: req.user._id,
            comboioNome: req.body.comboioNome,
            embarcacoes: comboioEmbarcacoes,
            comboioMesAnoAtual: moment(Date.now()).format('DD/MM/YYYY')
        });
    
        await novoComboio.save();
        req.flash('success_msg', 'Comboio formulado com sucesso!');
        res.redirect('/formulario');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', `Erro ao formular Comboio (${err})`);
        res.redirect('/formulario');
    }
  });


//----   Rota para visuaização de Comboio formulado   ----//


router.get('/formulario/comboiosVizu/:id', eUser, async(req, res) => {
    try{
        const comboios = await Comboio.findOne({_id: req.params.id}).lean()
            res.render('formulario/comboios/comboiosVizu', 
            {
                    comboios: comboios
            })
    }catch(err){
        console.log(err);
        req.flash('error_msg', `Erro ao visualizar este Comboio (${err})`);
        res.redirect('/comboios');
    }
})


//----  Rota para listagem de Comboios(user)   ----//


router.get('/comboios', eUser, async(req, res) => {
    try{
        const comboios = await Comboio.find({usuarioID: req.user._id}).lean()
        res.render('formulario/comboios/comboios', 
            {comboios: comboios
        })
    }catch(err){
        console.log(err);
        req.flash('error_msg', `Erro ao listar Comboios (${err})`);
        res.redirect('/formulario');
    }
})


//----  Rota de paginação de Comboio(user)   ----//


router.get('/comboios/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Comboio.count({usuarioID: req.user._id})
        if (parseInt(page) * limit >= contagem) {
            nextPage = ''
            hidden = 'hidden'
        } else {
            nextPage = parseInt(page) + 1
            hidden = ''
        }
  
        if (parseInt(page) == 2) {
            previousPage = ''
        } else {
            previousPage = parseInt(page) - 1
        }
        const comboios = await Comboio.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({ comboioMesAnoAtual: 'desc' })
        res.render('formulario/comboios/comboiosPage',
            {
                comboios: comboios,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {
        req.flash('error_msg', `Erro ao paginar Comboios (${err})`)
        res.redirect('/formulario')
    }
})


//----  Rota para formulário de validação de Comboio    ----//


router.get('/admin/comboiosValidate/:id', Admin, async(req, res) => {
    try{
        const comboios = await Comboio.findOne({_id: req.params.id}).lean()
        const embsIds = []

        comboios.embarcacoes.forEach((el) => {
            embsIds.push(el.id)
        })

        const embarcacoes = await Embarcacao.find({_id: embsIds}).lean()
            res.render('admin/comboios/comboiosValidate', 
            {
                comboios: comboios,
                embarcacoes: embarcacoes
            })
    }catch(err){
        console.log(err);
        req.flash('error_msg', `Erro ao mostrar página de validação de Comboio (${err})`);
        res.redirect('/admin/painel');
    }
})


//----  Rota para validação de Comboio   ----//


router.post('/comboiosValidate', Admin, async(req, res) => {
    try {
        const cleanString = req.body.embarcacoes.replace(/[\n' \[\]]/g, '');
        const embs = cleanString.split(',');
        const comboiosIds = embs.filter((item, index) => embs.indexOf(item) === index);

        const comboioEmbarcacoes = [];
    
        if(embs.length === 1){
            for (var i = 0; i < embs.length; i++) {
                async function pesquisarNome(id){
                const embarcacao = await Embarcacao.findOne({_id: id}).lean()
                return embarcacao.embarcacaoNome
                }
                const comboioEmbarcacao = {
                id: req.body.comboio,
                embarcacaoNome: await pesquisarNome(req.body.comboio),
                carga: req.body.comboiosCarga,
                quantidade: req.body.comboiosQuantidadeCarga,
                arqueacaoBruta: req.body.comboiosarqueacaoBruta
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }else{
            for (var i = 0; i < embs.length; i++) {
                async function pesquisarNome(id){
                const embarcacao = await Embarcacao.findOne({_id: id}).lean()
                return embarcacao.embarcacaoNome
                }
                const comboioEmbarcacao = {
                id: req.body.comboio[i],
                embarcacaoNome: await pesquisarNome(req.body.comboio[i]),
                carga: req.body.comboiosCarga[i],
                quantidade: req.body.comboiosQuantidadeCarga[i],
                arqueacaoBruta: req.body.comboiosarqueacaoBruta[i]
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }
    
        await Comboio.updateOne({_id: req.body.id}, {
          comboioNome: req.body.comboioNome,
          embarcacoes: comboioEmbarcacoes,
        });
    
    
        req.flash('success_msg', 'Comboio formulado com sucesso!');
        res.redirect('/admin/comboios');
    }catch(err){
        console.log(err);
        req.flash('error_msg', `Erro ao validar este Comboio (${err})`);
        res.redirect('/admin/comboios');
    }
})


//----  Rota para listagem de Comboios(admin)    ----//


router.get('/admin/comboios', Admin, async(req, res) => {
    try{
        const comboios = await Comboio.find().lean()
        res.render('admin/comboios/comboios', 
        {
            comboios: comboios
        })
    }catch(err){
        console.log(err);
        req.flash('error_msg', `Erro ao listar Comboios (${err})`);
        res.redirect('/admin/painel');
    }
  })
 

//----  Rota para paginação de Comboio(admin)     ----//


router.get('/admin/comboios/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Comboio.count()
        if (parseInt(page) * limit >= contagem) {
            nextPage = ''
            hidden = 'hidden'
        } else {
            nextPage = parseInt(page) + 1
            hidden = ''
        }

        if (parseInt(page) == 2) {
            previousPage = ''
        } else {
            previousPage = parseInt(page) - 1
        }
        const comboios = await Comboio.find().skip(skip).limit(limit).lean().sort({ comboioMesAnoAtual: 'desc' })
        res.render('admin/comboios/comboiosPage',
            {
                comboios: comboios,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {
        req.flash('error_msg', `Erro ao paginar Comboios (${err})`)
        res.redirect('/admin/painel')
    }
})


module.exports = router


*/