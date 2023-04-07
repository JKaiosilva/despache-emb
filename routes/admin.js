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
const mime = require('mime')
const pagination = require('../helpers/pagination')
const eAdmin = require('../helpers/eAdmin')

const upload = multer({
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename(req, file, callback) {
        const fileName = file.originalname
        return callback(null, fileName)
      },
    }),
  })


router.get('/painel', Admin, async(req, res) => {
    try{
        var usuariosOperador = await Usuario.find({_id: req.user._id}).lean();

        var avisos = await Aviso.find().count();
        var usuarios = await Usuario.find().count();
        var embarcacoes = await Embarcacao.find().count();
        var despachos = await Despacho.find().count();
        var avisoEntradas = await AvisoEntrada.find().count();
        var avisoSaidas = await AvisoSaida.find().count();
        
        res.render('admin/painel', 
        {avisos: avisos, 
            usuariosOperador: usuariosOperador, 
                usuarios: usuarios,
                    embarcacoes: embarcacoes,
                        despachos: despachos,
                            avisoEntradas: avisoEntradas,
                                avisoSaidas: avisoSaidas})
    }catch (err){
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar avisos')
        res.redirect('/')
    }
    
})


router.get('/avisos', Admin, async (req, res) => {
    try {
        const avisos = await Aviso.find().limit(5).lean().sort({data: 'desc'})
            res.render('admin/avisos/avisos', {avisos: avisos})
    }catch (err) {
        res.redirect('/painel')
    }
})


router.get('/avisos/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
        try{
            const contagem = await Aviso.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1;
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1;
            }
            const avisos = await Aviso.find().skip(skip).limit(limit).lean().sort({data: 'desc'})
                res.render('admin/avisos/avisosPage', 
                    {avisos: avisos,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden
                })
        } catch(err) {
            console.log(err)
        }
        

})

router.get('/avisos/novo', Admin, (req, res) => {
    res.render('admin/addaviso')
})

router.post('/avisos/novo', upload.single('foto'), async (req, res) => {
    try {
        const novoAviso = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            avisoData: moment(Date.now()).format('DD/MM/YYYY HH:mm')
        }
        
        if (req.file) {
            const contentType = mime.getType(req.file.originalname);
            const data = fs.readFileSync(req.file.path);
            novoAviso.contentType = contentType;
            novoAviso.data = data.toString('base64');
            excluir = fs.unlink(`./uploads/${req.file.originalname}`,(err => {
            }))
            
        }

        await new Aviso(novoAviso).save();
        req.flash('success_msg', 'Aviso postado com sucesso')
        res.redirect('/')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Houve um erro interno ao postar aviso')
        res.redirect('/')
    }
});

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