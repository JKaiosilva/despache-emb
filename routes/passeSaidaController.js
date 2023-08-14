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

const { Admin } = require('../helpers/perms/eAdmin')
const { eUser } = require('../helpers/perms/euser')
const { eOperador } = require('../helpers/perms/eOperador')

const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


//----      Rota para visualizar Passe de Saída     ----//


router.get('/formulario/passeSaidaVizu/:id', eOperador, async(req, res) => {
    try{
        const passeSaidas = await PasseSaida.findOne({_id: req.params.id}).lean()
        passeSaidas.destino = await Porto.findOne({_id: passeSaidas.destino}).lean()
        passeSaidas.validade = moment(parseInt(validade)).format('DD/MM/YYYY');
        res.render('formulario/passeSaidas/passeSaidasVizu', 
            {
                passeSaidas: passeSaidas
            })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar Passe de Saida: ${err}`);
        res.redirect('/painel')
    }
})


//----      Rota de listagem de passes      ----//


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
        req.flash('error_msg', `Erro ao listar Passes de Saida: ${err}`);
        res.redirect('/painel')
    }
})



module.exports = router;