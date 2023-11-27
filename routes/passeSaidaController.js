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
require('../models/Correcao')
require('../models/bin/entradaBin');
require('../models/PasseSaida');
require('../models/bin/PasseSaidaBin')

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
const Correcao = mongoose.model('correcoes')
const AvisoEntradaBin = mongoose.model('avisoEntradasBin');
const PasseSaida = mongoose.model('passeSaidas');
const PasseSaidaBin = mongoose.model('passeSaidasBin')

const {eOficial, eAdmin, eOperador, eAgencia, eDespachante} = require('../helpers/perms/permHash')


const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


//----      Rota para listar Passe de Saída (User)    ----//


router.get('/passeSaidas', eDespachante, async(req, res) => {
    try{
        const passeSaidas = await PasseSaida.find({agenciaID: req.user.agencia}).limit(5).lean().sort({date: 'desc'})

        for await(const passeSaida of passeSaidas){
            if(passeSaida.validade >= Date.now()){
                passeSaida.condicao = 1;
                passeSaida.editado = 'Validado';
            }else{
                passeSaida.condicao = 3
                passeSaida.editado = 'Não validado';
            }   
        }
        res.render('formulario/passeSaidas/passeSaidas',
        {
            passeSaidas: passeSaidas
        })
    }catch(err){
        req.flash('error_msg', `Erro ao listar passe de saida (${err})`)
        res.redirect('/formulario')
    }
})


//----      Rota para paginar Passe de Saída (User)    ----//


router.get('/passeSaidas/:page', eDespachante, async (req, res) => {
    try{
        const page = req.params.page || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        
        const contagem = await PasseSaida.count();
        if(parseInt(page) * limit >= contagem){
            nextPage = '';
            hidden = 'hidden';
        } else {
            nextPage = parseInt(page) + 1;
            hidden = ''
        }

        if(parseInt(page) == 2) {
            previousPage = ''
        }else{
            previousPage = parseInt(page) - 1
        }

        const passeSaidas = await PasseSaida.find({_id: req.user._id}).skip(skip).limit(limit).lean().sort({date: 'desc'})
        for(const passeSaida of passeSaidas){
            passeSaida.condicao = 3;
            passeSaida.editado = 'Não Validado'
            if(passeSaida.validade >= Date.now()){
                passeSaida.condicao = 1;
                passeSaida.editado = 'Validado'
            }
            passeSaida.validadeDate = moment(parseInt(passeSaida.validade)).format('DD/MM/YYYY');

        }
        res.render('formulario/passeSaidas/passeSaidasPage', 
        {
            passeSaidas: passeSaidas
        })
    }catch(err){
        console.log(err)
        req.flash('error_mg', `Erro ao paginas Passes de Saida: ${err}`);
        res.redirect('/');
    }
})

//----      Rota para visualizar Passe de Saída    ----//


router.get('/formulario/passeSaidaVizu/:id', eDespachante, async(req, res) => {
    try{
        const passeSaidas = await PasseSaida.findOne({_id: req.params.id}).lean()
        passeSaidas.destino = await Porto.findOne({_id: passeSaidas.destino}).lean()
        passeSaidas.date = moment(parseInt(passeSaidas.date)).format('DD/MM/YYYY');
        passeSaidas.validade = moment(parseInt(passeSaidas.validade)).format('DD/MM/YYYY');
        
        res.render('formulario/passeSaidas/passeSaidasVizu', 
            {
                passeSaidas: passeSaidas
            })
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar Passe de Saida: ${err}`);
        res.redirect('/')
    }
})


//----      Rota de listagem de Passes de Saída      ----//


router.get('/admin/passeSaidas', eOperador, async(req, res) => {
    try{
        const passeSaidas = await PasseSaida.find().limit(5).sort({validade: 'desc'}).lean();
            
        for(const passeSaida of passeSaidas){
            passeSaida.condicao = 3;
            passeSaida.editado = 'Não Validado'
            if(passeSaida.validade >= Date.now()){
                passeSaida.condicao = 1;
                passeSaida.editado = 'Validado'
            }
            passeSaida.validadeData = moment(parseInt(passeSaida.validade)).format('DD/MM/YYYY');
        }
        
        res.render('formulario/passeSaidas/passeSaidas', 
            {
                passeSaidas: passeSaidas
            })
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao listar Passes de Saida: ${err}`);
        res.redirect('/admin/painel')
    }
})


//----      Rota de paginação de Passes de Saída        ----//


router.get('/admin/passeSaidas/:page', eOperador, async (req, res) => {
    try{
        const page = req.params.page || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        
        const contagem = await PasseSaida.count();
        if(parseInt(page) * limit >= contagem){
            nextPage = '';
            hidden = 'hidden';
        } else {
            nextPage = parseInt(page) + 1;
            hidden = ''
        }

        if(parseInt(page) == 2) {
            previousPage = ''
        }else{
            previousPage = parseInt(page) - 1
        }

        const passeSaidas = await PasseSaida.find().skip(skip).limit(limit).lean().sort({date: 'desc'})
        for(const passeSaida of passeSaidas){
            passeSaida.condicao = 3;
            passeSaida.editado = 'Não Validado'
            if(passeSaida.validade >= Date.now()){
                passeSaida.condicao = 1;
                passeSaida.editado = 'Validado'
            }
            passeSaida.validadeDate = moment(parseInt(passeSaida.validade)).format('DD/MM/YYYY');
        }
        res.render('formulario/passeSaidas/passeSaidasPage', 
        {
            passeSaidas: passeSaidas
        })
    }catch(err){
        console.log(err)
        req.flash('error_mg', `Erro ao paginas Passes de Saida: ${err}`);
        res.redirect('/admin/painel');
    }
})


//----      Rota para deletar Passe de Saída        ----//


router.post('/admin/passeSaida/deletar', eOperador, async(req, res) =>{
    try{
        const id = req.body.id;
        const passeSaida = await PasseSaida.findOne({_id: id});
        passeSaida.deletadoPor = req.user._id;
        passeSaida.deletadoEm = Date.now();
        new PasseSaidaBin(passeSaida).save();
        const deletarPasseSaida = await PasseSaida.deleteOne({_id: id});
            req.flash('success_msg', 'Passe de Saida deletado com sucesso.')
            res.redirect('/admin/passeSaidas')
    }catch(err){
        console.log(err)
        req.flash('error_mg', `Erro ao deletar Passe de Saida: ${err}`);
        res.redirect('/admin/painel');
    }
})

module.exports = router;