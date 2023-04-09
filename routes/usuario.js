const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const passport = require('passport')
const bcrypt = require('bcryptjs')
require('../models/Embarcacao')
const Embarcacao = mongoose.model('embarcacoes')


// Cadatro de usuário

        router.get('/cadastro', (req, res) => {
            res.render('usuarios/cadastro')
        })

        router.post('/cadastro', (req, res) => {
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
                            senha: req.body.senha
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


// Login usuario
            router.get('/login', (req, res) => {
                res.render('usuarios/login')
            })

            router.post('/login', (req, res, next) => {
                passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/usuarios/login',
                    failureFlash: true
                })(req, res, next)
            })


// Logout usuário 
            router.get('/logout', (req, res) => {
                req.logout((err) => {
                    if(err) {
                        return next(err)
                    }
                    req.flash('success_msg', 'Deslogado com sucesso!')
                    res.redirect('/')
                })
            })

// Perfil usuário

            router.get('/perfil', (req, res) => {
                Usuario.find({_id: req.user._id}).lean().sort().then((usuarios) => {
                    Embarcacao.find({usuarioID: req.user._id}).lean().sort({embarcacaoDataCadastro: 'asc'}).then((embarcacoes) => {
                        res.render('usuarios/perfil', {usuarios: usuarios, embarcacoes: embarcacoes})
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possivel obter seus dados')
                    res.redirect('/')
                })
            })


        



module.exports = router