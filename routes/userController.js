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


router.get('/admin/listaUsers', Admin, (req, res) => {
    Usuario.find().lean().sort({ nome: 'asc' }).then((usuarios) => {
        res.render('admin/users/users', { usuarios: usuarios })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar usuarios!')
        res.redirect('/')
    })
})


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

    }
})


router.get('/admin/users/usuariosVizu/:id', Admin, (req, res) => {
    Usuario.find({ _id: req.params.id }).lean().then((usuario) => {
        res.render('admin/users/usuariosVizu', { usuario: usuario })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar usuarios.')
        res.redirect('admin/users/users')
    })
})


router.get('/admin/users/usuariosEdit/:id', Admin, async (req, res) => {
    try{
        const usuario = await Usuario.findOne({_id: req.params.id}).lean()
        res.render('admin/users/usuariosEdit', {
            usuario: usuario
        })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao mostrar usuarios.')
        res.redirect('admin/users/users')
    }
})


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
                    req.flash('error_msg', 'Houve um erro ao salvar usuario')
                }
                await Usuario.updateOne({_id: id},{
                    nome: req.body.nome,
                    email:req.body.email,
                    CPF: req.body.CPF,
                    senha: hash
                })
            })
        })


        req.flash('success_msg', 'Usuario editado com sucesso')
        res.redirect('/admin/painel')
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao editar usuario.')
        res.redirect('/admin/painel')
    }
})



router.get('/usuarios/cadastro', (req, res) => {
    res.render('usuarios/cadastro')
})


router.post('/usuarios/cadastro', (req, res) => {
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
                res.redirect('/usuarios/cadastro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    CPF: req.body.CPF,
                    senha: req.body.senha,
                    dataCadastro: Date.now(),
                    usuarioMesAtual: moment(Date.now()).format('MM/YYYY')
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuario criado com sucesso')
                            res.redirect('/usuarios/login')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao salvar usuario')
                            res.redirect('/usuarios/cadastro')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }

})


router.get('/usuarios/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/usuarios/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true,
    })(req, res, next)
})


router.get('/usuarios/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash('success_msg', 'Deslogado com sucesso!')
        res.redirect('/')
    })
})


router.get('/usuarios/perfil', eUser, (req, res) => {
    Usuario.find({_id: req.user._id}).lean().sort().then((usuarios) => {
        Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({embarcacaoDataCadastro: 'asc'}).then((embarcacoes) => {
            res.render('usuarios/perfil', {usuarios: usuarios, embarcacoes: embarcacoes})
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possivel obter seus dados')
        res.redirect('/')
    })
})


module.exports = router