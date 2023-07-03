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

const { Admin } = require('../helpers/eAdmin')
const { eUser } = require('../helpers/eUser')

const passport = require('passport')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')


//----    Rota para formulário de cadastro de Usuário    ----//


router.get('/usuarios/cadastroUser', async (req, res) => {
    try{
        const agencias = await Usuario.find({eAgencia: 1}).lean()
        res.render('usuarios/cadastro', 
        {
            agencias: agencias
        })
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de cadastro (${err})`)
        res.redirect('/')
    }
})


//----    Rota de postagem de cadastro de Usuário   ----//


router.post('/usuarios/cadastroUser', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Nome inválido'})
    }if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'Email inválido'})
    }if(!req.body.CPF || typeof req.body.CPF == undefined || req.body.CPF == null || req.body.CPF.length < 11) {
        erros.push({texto: 'CPF inválido'})
    }if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha inválida"})
    }if(req.body.senha.length < 6) {
        erros.push({texto: 'Senha muito curta'})
    }if(req.body.senha != req.body.senha2) { 
        erros.push({texto: 'Senhas diferentes'})
    }if(erros.length > 0) {
        res.render('usuarios/cadastro', {erros: erros})
    }else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('error_msg', 'Email já cadastrado')
                res.redirect('/usuarios/cadastroUser')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email:req.body.email,
                    CPF: req.body.CPF,
                    eAdmin: 0,
                    eAgencia: 0,
                    agencia: req.body.agencia,
                    eUser: 1,
                    senha: req.body.senha,
                    dataCadastro: Date.now(),
                    usuarioMesAnoAtual: moment(Date.now()).format('MM/YYYY')
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            console.log(erro)
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuario criado com sucesso')
                            res.redirect('/usuarios/login')
                        }).catch((err) => {
                            console.log(err)
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', `Erro ao cadastrar usuário (${err})`)
            res.redirect('/')
        })
    }
})


//----    Rota de visualização de Usuário(admin)   ----//


router.get('/admin/users/usuariosVizu/:id', Admin, async (req, res) => {
    try{
        const usuario = await Usuario.find({ _id: req.params.id }).lean()
            res.render('admin/users/usuariosVizu', 
                { 
                    usuario: usuario 
                })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar Usuário (${err})`)
        res.redirect('/admin/painel')
    }
})


//----  Rota para visualização de login de Usuário   ----//


router.get('/usuarios/login', async (req, res) => {
    try{
        res.render('usuarios/login')
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar página de login (${err})`)
        res.redirect('/')
    }
})


//----    Rota de postagem de login de Usuário   ----//


router.post('/usuarios/login', async (req, res, next) => {
    try{
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/usuarios/login',
            failureFlash: true,
        })(req, res, next)
    }catch(err){
        req.flash('error_msg', `Erro ao fazer login (${err})`)
        res.redirect('/')
    }
})


//----    Rota para formulário de edição de Usuário    ----//


router.get('/admin/users/usuariosEdit/:id', Admin, async (req, res) => {
    try{
        const usuario = await Usuario.findOne({_id: req.params.id}).lean()
        const agencias = await Usuario.find({eAgencia: 1}).lean()
            res.render('admin/users/usuariosEdit', 
                {
                    usuario: usuario,
                    agencias: agencias
                })
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de edição de Usuário (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para postagem de edição de Usuário   ----//


router.post('/admin/users/usuarioEdit', Admin, async(req, res) => {
    try{
        const id = req.body.id
        const usuario = await Usuario.find({ _id: id }).lean();

        if (!usuario) {
          req.flash('error_msg', 'Usuário não encontrado.');
          return res.redirect('/admin/painel');
        }

        bcrypt.genSalt(10, (err, salt)  =>  {
            bcrypt.hash(req.body.senha, salt, async (err, hash)  =>  {
                if(err){
                    console.log(err)
                    req.flash('error_msg', `Erro ao editar Usuário (${err})`)
                }
                await Usuario.updateOne({_id: id},{
                    nome: req.body.nome,
                    email:req.body.email,
                    CPF: req.body.CPF,
                    eAdmin: req.body.eAdmin,
                    eAgencia: req.body.eAgencia,
                    agencia: req.body.agencia,
                    eUser: req.body.eUser,
                    proprietario: req.body.proprietario,
                    sociosProprietarios: req.body.sociosProprietarios,
                    periodoContrato: req.body.periodoContrato,
                    senha: hash
                })
            })
        })

        req.flash('success_msg', 'Usuario editado com sucesso')
        res.redirect('/admin/painel')
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao editar Usuário (${err})`)
        res.redirect('/admin/painel')
    }
})


//----      Rota de visualização de formulario de Agencia       ----//


router.get('/admin/addAgencia', Admin, async(req, res) => {
    try{
        res.render('admin/users/addAgencia')
    }catch(err){
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de adição de Agencia: (${err})`)
        res.redirect('/admin/painel')
    }
})


//----      Rota para adicionar Agencia


router.post('/admin/users/addAgencia', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Nome inválido'})
    }if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'Email inválido'})
    }if(!req.body.CPF || typeof req.body.CPF == undefined || req.body.CPF == null || req.body.CPF.length < 11) {
        erros.push({texto: 'CPF inválido'})
    }if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha inválida"})
    }if(req.body.senha.length < 6) {
        erros.push({texto: 'Senha muito curta'})
    }if(req.body.senha != req.body.senha2) { 
        erros.push({texto: 'Senhas diferentes'})
    }if(erros.length > 0) {
        res.render('usuarios/cadastro', {erros: erros})
    }else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('error_msg', 'Email já cadastrado')
                res.redirect('/usuarios/cadastroUser')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email:req.body.email,
                    CPF: req.body.CPF,
                    eAdmin: 0,
                    eAgencia: 1,
                    proprietario: req.body.proprietario,
                    sociosProprietarios: req.body.sociosProprietarios,
                    eUser: 0,
                    senha: req.body.senha,
                    dataCadastro: Date.now(),
                    usuarioMesAnoAtual: moment(Date.now()).format('MM/YYYY')
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            console.log(erro)
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuario criado com sucesso')
                            res.redirect('/usuarios/login')
                        }).catch((err) => {
                            console.log(err)
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', `Erro ao cadastrar usuário (${err})`)
            res.redirect('/')
        })
    }
})



//----    Rota de listagem de Usuários    ----//


router.get('/admin/listaUsers', Admin, async (req, res) => {
    try{
        const usuarios = await Usuario.find().lean().sort({ nome: 'asc' })
            res.render('admin/users/users', 
                { 
                    usuarios: usuarios 
                })
    }catch(err){
        req.flash('error_msg', `Erro ao listar Usuários (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de paginação de Usuários     ----//


router.get('/admin/listaUsers/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Usuario.count()
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
        const usuarios = await Usuario.find().skip(skip).limit(limit).lean().sort({ nome: 'desc' })
            res.render('admin/users/usersPage',
                {
                    usuarios: usuarios,
                    nextPage: nextPage,
                    previousPage: previousPage,
                    hidden: hidden
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao paginar Usuários (${err})`)
        res.redirect('/admin/painel')
    }
})


//----   Rota de logout de Usuário   ----//


router.get('/usuarios/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash('success_msg', 'Deslogado com sucesso!')
        res.redirect('/')
    })
})


//----    Rota de visualização de perfil de Usuário(user)     ----//


router.get('/usuarios/perfil', eUser, async (req, res) => {
    try{
        const usuarios = await Usuario.find({_id: req.user._id}).lean().sort()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({embarcacaoDataCadastro: 'asc'})
            res.render('usuarios/perfil', 
                {
                    usuarios: usuarios, 
                    embarcacoes: embarcacoes
                })
    }catch(err){
        req.flash('error_msg', `Erro ao mostrar perfil de Usuário (${err})`)
        res.redirect('/')
    }
})


module.exports = router