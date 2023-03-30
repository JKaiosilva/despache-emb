const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {Admin} = require('../helpers/eAdmin')
const Usuario = mongoose.model('usuarios')
require('../models/Aviso')
const Aviso = mongoose.model('avisos')
const moment = require('moment')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')
require('../models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')
require('../models/AvisoSaida')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const fs = require('fs')
const path = require('path')
require('dotenv/config');
const multer = require('multer')
const imgModel = require('../models/Aviso');


const upload = multer({
    dest: './uploads',
    storage: multer.diskStorage({
       destination: (req, file, cb) => {
           cb(null, './uploads');
       },
       filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
    })
});



router.get('/painel', Admin, (req, res) => {
    Usuario.find({_id: req.user._id}).lean().sort().then((usuarios) => {
        res.render('admin/painel', {usuarios: usuarios})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar usuarios!')
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

router.post('/avisos/novo', upload.single('img'), (req, res) => {
    const novoAviso = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        data: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
        img: {
            data: fs.readFileSync(path.join(__dirname + '../uploads/' + req.file.img)),
            contentType: 'image/png'  
        }    
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

router.get('/listaUsers', Admin, (req, res) => {
    Usuario.find().lean().sort({nome: 'desc'}).then((usuarios) => {
        res.render('admin/listaUsers', {usuarios: usuarios})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar usuarios!')
        res.redirect('/')
    })
   
})


router.get('/listaDespacho', Admin, (req, res) => {
    Despacho.find().lean().sort({data: 'desc'}).then((despachos) => {
        res.render('admin/listaDespacho', {despachos: despachos})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar despachos!')
        res.redirect('/')
    }) 
})

router.get('/listaAvisoEntrada', Admin, (req, res) => {
    AvisoEntrada.find().lean().sort({data: 'desc'}).then((avisoEntradas) => {
        res.render('admin/listaAvisoEntrada', {avisoEntradas: avisoEntradas})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar avisos de entrada!')
        res.redirect('/')
    }) 
})

router.get('/listaAvisoSaida', Admin, (req, res) => {
    AvisoSaida.find().lean().sort({data: 'desc'}).then((avisoSaidas) => {
        res.render('admin/listaAvisoSaida', {avisoSaidas: avisoSaidas})
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar avisos de saida!')
        res.redirect('/')
    }) 
})

router.get('/listaEmbarcacoes', Admin, (req, res) => {
    Embarcacao.find().lean().sort({EmbarcacaoNome: 'asc'}).then((embarcacoes) => {
        res.render('admin/listaEmbarcacoes', {embarcacoes: embarcacoes})
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar embarcações')
        res.redirect('/')
    })
})


router.get('/usuariosVizu/:id', Admin, (req, res) => {
    Usuario.find({_id: req.params.id}).lean().then((usuario) => {
        res.render('admin/usuariosVizu', {usuario: usuario})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar usuarios.')
        res.redirect('admin/listaUsers')
    })
})


router.get('/embarcacaoVizu/:id', Admin, (req, res) => {
    Embarcacao.find({_id: req.params.id}).lean().then((embarcacao) => {
        res.render('admin/embarcacaoVizu', {embarcacao: embarcacao})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar embarcação')
        res.redirect('admin/listaEmbarcacoes')
    })
})

module.exports = router