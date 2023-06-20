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

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')

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


//----  Configuração para upload de imagens do aviso    ----//


const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename(req, file, callback) {
            const fileName = file.originalname
            return callback(null, fileName)
        },
    }),
})


//----  Rota para formulario de adição de aviso    ----//


router.get('/admin/addaviso', Admin, (req, res) => {
    res.render('admin/avisos/addaviso')
})


//----  Rota para postar aviso   ----//


router.post('/admin/avisos/novo', upload.single('foto'), async (req, res) => {
    try {
        const novoAviso = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            avisoData: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            avisoMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }

        if (req.file) {
            const contentType = mime.getType(req.file.originalname);
            const data = fs.readFileSync(req.file.path);
            novoAviso.contentType = contentType;
            novoAviso.data = data.toString('base64');
            excluir = fs.unlink(`./uploads/${req.file.originalname}`, (err => {
            }))

        }

        await new Aviso(novoAviso).save();
        req.flash('success_msg', 'Aviso postado com sucesso')
        res.redirect('/admin/avisos')
    } catch (err) {
        req.flash('error_msg', 'Houve um erro interno ao postar aviso')
        res.redirect('/admin/avisos')
    }
});


//----  Rota para deletar aviso   ----//


router.post('/admin/avisos/deletar', Admin, (req, res) => {
    Aviso.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Aviso deletado com sucesso!')
        res.redirect('/admin/avisos')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao excluier aviso')
        res.redirect('/admin/avisos')
    })
})


//----  Rota de listagem de avisos    ----//


router.get('/admin/avisos', Admin, async (req, res) => {
    try {
        const avisos = await Aviso.find().limit(5).lean().sort({ avisoData: 'desc' })
        res.render('admin/avisos/avisos', { avisos: avisos })
    } catch (err) {
        res.redirect('/painel')
    }
})


//----  Rota de paginação de avisos    ----//


router.get('/admin/avisos/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Aviso.count()
        if (parseInt(page) * limit >= contagem) {
            nextPage = ''
            hidden = 'hidden'
        } else {
            nextPage = parseInt(page) + 1;
            hidden = ''
        }

        if (parseInt(page) == 2) {
            previousPage = ''
        } else {
            previousPage = parseInt(page) - 1;
        }
        const avisos = await Aviso.find().skip(skip).limit(limit).lean().sort({ avisoData: 'desc' })
        res.render('admin/avisos/avisosPage',
            {
                avisos: avisos,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {

    }
})


module.exports = router