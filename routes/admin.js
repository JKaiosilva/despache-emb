const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {Admin} = require('../helpers/eAdmin')
const Usuario = mongoose.model('usuarios')
const Formulario = mongoose.model('formularios')
require('../models/Aviso')
const Aviso = mongoose.model('avisos')
const moment = require('moment')


router.get('/painel', Admin, (req, res) => {
    res.render('admin/painel')
})


router.get('/listaUsers', Admin, (req, res) => {
    Usuario.find().lean().sort({nome: 'desc'}).then((usuarios) => {
        res.render('admin/listaUsers', {usuarios: usuarios})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar usuarios!')
        res.redirect('/')
    })
   
})


router.get('/listaForms', Admin, (req, res) => {
    Formulario.find().lean().sort({data: 'desc'}).then((formularios) => {
        res.render('admin/listaForms', {formularios: formularios})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar formularios!')
        res.redirect('/')
    })
   
})

router.get('/avisos', Admin, (req, res) => {
    Aviso.find().lean().sort({data: 'desc'}).then((avisos) => {
        res.render('admin/avisos', {avisos: avisos})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar avisos')
        res.redirect('/painel')
    })
})

router.get('/avisos/novo', Admin, (req, res) => {
    res.render('admin/addaviso')
})

router.post('/avisos/novo', Admin, (req, res) => {
    const novoAviso = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        data: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
    } 
    new Aviso(novoAviso).save().then(() => {
        req.flash('success_msg', 'Aviso postado com sucesso')
        res.redirect('/admin/avisos')
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro interno ao postar aviso')
        res.redirect('admin/avisos')
    })
})

router.post('/avisos/deletar', Admin, (req, res) => {
    Aviso.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Aviso deletado com sucesso!')
        res.redirect('/admin/avisos')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao excluier aviso')
        res.redirect('/admin/avisos')
    })
})

module.exports = router