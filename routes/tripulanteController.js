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

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')

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


//----  Rota para formulário de cadastro de Tripulante    ----//


router.get('/admin/addTripulante', eOperador, async (req, res) => {
    try{
        res.render('admin/tripulantes/addTripulante')
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar página de adição de Tripulantes (${err})`)
        res.redirect('/admin/painel')
    }
})


//----  Rota de postagem de Tripulante   ----//


router.post('/admin/addTripulante', eOperador, async (req, res) => {
    try {
        const novoTripulante = {
            usuarioID: req.user._id,
            tripulanteNome: req.body.tripulanteNome,
            tripulanteGrau: req.body.tripulanteGrau,
            tripulanteDataNascimento: req.body.tripulanteDataNascimento,
            tripulanteNCIR: req.body.tripulanteNCIR,
            tripulanteValidadeCIR: req.body.tripulanteValidadeCIR,
            tripulanteValidadeCIRNumber: Date.parse(req.body.tripulanteValidadeCIR),
            tripulanteDataCadastro: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            tripulanteDataNumber: Date.now(),
            tripulanteMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }
        await new Tripulante(novoTripulante).save()
        req.flash('success_msg', 'Tripulante cadastrado com sucesso')
        res.redirect('/admin/painel')
    } catch (err) {
        req.flash('error_msg', `Erro ao cadastrar Tripulante (${err})`)
        res.redirect('/admin/painel')
    }
})


//----  Rota de visualização de Tripulante   ----//


router.get('/admin/tripulantesVizu/:id', eOperador, async(req, res) => {
    try{
        const tripulantes = await Tripulante.findOne({_id: req.params.id}).lean()
            res.render('admin/tripulantes/tripulantesVizu', 
                {
                    tripulantes: tripulantes
                })
    }catch(err){
        req.flash('error_msg', `Erro ao visualizar Tripualnte (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de formulário de edição de Tripulante    ----//


router.get('/admin/tripulantesEdit/:id', eOperador, async(req, res) => {
    try{
        const tripulante = await Tripulante.findOne({_id: req.params.id}).lean()
            res.render('admin/tripulantes/tripulantesEdit', 
                {
                    tripulante: tripulante
                })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar página de edição de Tripulante (${err})`)
        res.redirect('/admin/painel')
    }
})


//----  Rota de postagem para edição de Tripulante   ----//


router.post('/admin/tripulantesEdit', eOperador, async(req, res) => {
    try{
        await Tripulante.updateOne({_id: req.body.id}, {
            tripulanteNome: req.body.tripulanteNome,
            tripulanteGrau: req.body.tripulanteGrau,
            tripulanteDataNascimento: req.body.tripulanteDataNascimento,
            tripulanteNCIR: req.body.tripulanteNCIR,
            tripulanteValidadeCIR: req.body.tripulanteValidadeCIR,
            tripulanteValidadeCIRNumber: Date.parse(req.body.tripulanteValidadeCIR),
        })
        req.flash('success_msg', 'Tripulante atualizado com sucesso!')
        res.redirect('/admin/painel')
    }catch(err){
        req.flash('error_msg', `Erro ao editar Tripulante (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de listagem de Tripulantes    ----//


router.get('/admin/tripulantes', eOperador, async (req, res) => {
    try {
        const tripulantes = await Tripulante.find().lean().sort({ tripulanteNome: 'asc' })
            res.render('admin/tripulantes/tripulantes',
                {
                    tripulantes: tripulantes
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao listar Tripulantes (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de paginação de Tripulantes     ----//


router.get('/admin/tripulantes/:page', eOperador, async(req, res) => {

    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try{
        const contagem = Tripulante.count()
        if(parseInt(page) * limit >= contagem){
            nextPage = ''
            hidden = 'hidden'
        }else{
            nextPage = parseInt(page) + 1
            hidden = ''
        }

        if(parseInt(page) == 2){
            previousPage = ''
        }else {
            previousPage = parseInt(page) - 1
        }
        const tripulantes = await Tripulante.find().skip(skip).limit(limit).lean().sort({tripulanteNome: 'asc'})
            res.render('admin/tripulantes/tripulantesPage',
                {   
                    tripulantes: tripulantes,
                    nextPage: nextPage,
                    previousPage: previousPage,
                    hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', `Erro ao paginar Tripulantes (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de formulação de PDF de Tripulante   ----//


router.get('/tripulantes/:id/pdf', eOperador, async (req, res) => {
    try{
        const tripulantes = await Tripulante.findOne({_id: req.params.id}).lean()

        const html = `
        
        <div class="card">
    <div class="card-body">
        <form>
                <div>

                    <label>Nome completo</label>
                    <input value="${tripulantes.tripulanteNome}" type="text" disabled>
                </div>
                <div>
                    <label>Grau ou Função</label>
                    <input value="${tripulantes.tripulanteGrau}" type="text" disabled>
                    <label>Data de nascimento</label>
                    <input value="${tripulantes.tripulanteDataNascimento}" type="text" disabled>
                </div>
                <div class="input-group mb-3">
                    <label>N° da CIR</label>
                    <input value="${tripulantes.tripulanteNCIR}" type="text" disabled>
                    <label>Validade da CIR</label>
                    <input value="${tripulantes.tripulanteValidadeCIR}" type="text" disabled>
                </div>
                <label class="text-center">Cadastrado em: ${tripulantes.tripulanteDataCadastro}</label>
        </form>
    </div>
</div>
        
        `
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err);
            res.attachment(`${tripulantes.saidaNprocesso}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
          
          });
    }catch(err){
        req.flash('error_msg', `Erro ao gerar PDF deste Tripulante (${err})`)
        res.redirect('/admin/painel') 
    }
})


module.exports = router