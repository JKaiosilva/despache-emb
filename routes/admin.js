const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {Admin} = require('../helpers/eAdmin')
const Usuario = mongoose.model('usuarios')
const Formulario = mongoose.model('formularios')


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

module.exports = router