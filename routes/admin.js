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
const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename(req, file, callback) {
            const fileName = file.originalname
            return callback(null, fileName)
        },
    }),
})




router.get('/painel', Admin, async (req, res) => {
    try {

        const API_KEY = process.env.API_KEY

        var usuariosOperador = await Usuario.find({ _id: req.user._id }).lean();
        tempo = {}
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=-19.0092&lon=-57.6533&units=metric&appid=${API_KEY}`)
        .then(response => {
            tempo.data = response.data
        })

        const {data} = await axios.get('https://www.marinha.mil.br/chn-6/');
        const $ = cheerio.load(data)

        const medidaRio = {}
        $('.table-responsive table tbody').each((i, elem) => {
            var medida_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-altura"]').last().text().replace('\n            ', '').replace('          ', '');
            medidaRio.data = medida_ladario
        })
        const dataHoje = moment(Date.now()).format('DD/MM/YYYY HH:mm')

        var avisos = await Aviso.find().count();
        var usuarios = await Usuario.find().count();
        var embarcacoes = await Embarcacao.find().count();
        var despachos = await Despacho.find().count();
        var avisoEntradas = await AvisoEntrada.find().count();
        var avisoSaidas = await AvisoSaida.find().count();
        var tripulantes = await Tripulante.find().count()
        var relatorios = await Relatorio.find().count()
        var portos = await Porto.find().count()


        res.render('admin/painel',
            {
                avisos: avisos,
                usuariosOperador: usuariosOperador,
                usuarios: usuarios,
                embarcacoes: embarcacoes,
                despachos: despachos,
                avisoEntradas: avisoEntradas,
                avisoSaidas: avisoSaidas,
                tripulantes: tripulantes,
                relatorios: relatorios,
                portos: portos,
                tempo: tempo,
                medidaRio: medidaRio,
                dataHoje: dataHoje

            })
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar avisos')
        res.redirect('/')
    }

})


router.get('/avisos', Admin, async (req, res) => {
    try {
        const avisos = await Aviso.find().limit(5).lean().sort({ avisoData: 'desc' })
        res.render('admin/avisos/avisos', { avisos: avisos })
    } catch (err) {
        res.redirect('/painel')
    }
})


router.get('/avisos/:page', Admin, async (req, res) => {
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

router.get('/addaviso', Admin, (req, res) => {
    res.render('admin/avisos/addaviso')
})

router.post('/avisos/novo', upload.single('foto'), async (req, res) => {
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

router.post('/avisos/deletar', Admin, (req, res) => {
    Aviso.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Aviso deletado com sucesso!')
        res.redirect('/admin/avisos')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao excluier aviso')
        res.redirect('/admin/avisos')
    })
})

router.get('/listaUsers', Admin, (req, res) => {
    Usuario.find().lean().sort({ nome: 'asc' }).then((usuarios) => {
        res.render('admin/users/users', { usuarios: usuarios })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar usuarios!')
        res.redirect('/')
    })
})

router.get('/listaUsers/:page', Admin, async (req, res) => {
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


router.get('/despachos', Admin, (req, res) => {
    Despacho.find().limit(5).lean().sort({ despachoData: 'desc' }).then((despachos) => {
        res.render('admin/despachos/listaDespacho', { despachos: despachos })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar despachos!')
        res.redirect('/')
    })
})


router.get('/despachos/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Despacho.count()
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
        const despachos = await Despacho.find().skip(skip).limit(limit).lean().sort({ despachoData: 'desc' })
        res.render('admin/despachos/despachosPage',
            {
                despachos: despachos,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno ao mostrar despachos!')
        res.redirect('/')
    }
})


router.get('/entradas', Admin, (req, res) => {
    AvisoEntrada.find().limit(5).lean().sort({ entradaData: 'desc' }).then((avisoEntradas) => {
        res.render('admin/entradas/entradas', { avisoEntradas: avisoEntradas })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar avisos de entrada!')
        res.redirect('/')
    })
})


router.get('/entradasPage/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await AvisoEntrada.count()
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
            previousPage = parseInt(page) - 1
        }
        const avisoEntradas = await AvisoEntrada.find().skip(skip).limit(limit).lean().sort({ entradaData: 'desc' })
        res.render('admin/entradas/entradasPage',
            {
                avisoEntradas: avisoEntradas,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {

    }
})


router.get('/saidas', Admin, (req, res) => {
    AvisoSaida.find().limit(5).lean().sort({ saidaData: 'desc' }).then((avisoSaidas) => {
        res.render('admin/saidas/saidas', { avisoSaidas: avisoSaidas })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar avisos de saida!')
        res.redirect('/')
    })
})


router.get('/saidasPage/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await AvisoSaida.count()
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
            previousPage = parseInt(page) - 1
        }
        const avisoSaidas = await AvisoSaida.find().skip(skip).limit(limit).lean().sort({ saidaData: 'desc' })
        res.render('admin/saidas/saidasPage',
            {
                avisoSaidas: avisoSaidas,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {

    }
})


router.get('/embarcacoes', Admin, (req, res) => {
    Embarcacao.find().limit(5).lean().sort({ EmbarcacaoNome: 'asc' }).then((embarcacoes) => {
        res.render('admin/embarcacoes/listaEmbarcacoes', { embarcacoes: embarcacoes })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar embarcações')
        res.redirect('/')
    })
})


router.get('/embarcacoes/:page', Admin, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        const contagem = await Embarcacao.count()
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
        const embarcacoes = await Embarcacao.find().skip(skip).limit(limit).lean().sort({ EmbarcacaoNome: 'asc' })
        res.render('admin/embarcacoes/embarcacoesPage',
            {
                embarcacoes: embarcacoes,
                nextPage: nextPage,
                previousPage: previousPage,
                hidden: hidden
            })
    } catch (err) {

    }
})


router.get('/embarcacoesEdit/:id', Admin, async(req, res) => {
    try{
        const embarcacao = await Embarcacao.findOne({_id: req.params.id}).lean()
        res.render('admin/embarcacoes/embarcacaoEdit', {
            embarcacao: embarcacao
        })
    }catch(err){

    }
})


router.post('/embarcacoesEdit', Admin, async(req, res) => {
    try{
        await Embarcacao.updateOne({_id: req.body.id}, {
            embarcacaoNome: req.body.embarcacaoNome,
            embarcacaoTipo: req.body.embarcacaoTipo,
            embarcacaoBandeira: req.body.embarcacaoBandeira,
            embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
            embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
            embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
            embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
            embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
            embarcacaoArmador: req.body.embarcacaoArmador,
            embarcacaoNCRA: req.body.embarcacaoNCRA,
            embarcacaoValidade: req.body.embarcacaoValidade,
        })
        req.flash('success_msg', 'Embarcação editada com sucesso!')
        res.redirect('painel')
    }catch(err){
        req.flash('error_msg', 'Erro ao editar embarcação.')
        res.redirect('painel')
    }
})


router.get('/users/usuariosVizu/:id', Admin, (req, res) => {
    Usuario.find({ _id: req.params.id }).lean().then((usuario) => {
        res.render('admin/users/usuariosVizu', { usuario: usuario })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao mostrar usuarios.')
        res.redirect('admin/users/users')
    })
})


router.get('/users/usuariosEdit/:id', Admin, async (req, res) => {
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


router.post('/users/usuarioEdit', Admin, async(req, res) => {
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





router.get('/tripulantes', Admin, async (req, res) => {
    try {
        const tripulantes = await Tripulante.find().lean().sort({ tripulanteNome: 'asc' })
        res.render('admin/tripulantes/tripulantes',
            {
                tripulantes: tripulantes
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno')
        res.redirect('admin/painel')
    }
})


router.get('/tripulantes/:page', Admin, async(req, res) => {

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
                {tripulantes: tripulantes,
                    nextPage: nextPage,
                        previousPage: previousPage,
                            hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar tripulantes!')
        res.redirect('/')
    }
})


router.get('/addTripulante', Admin, async (req, res) => {
    try{
        res.render('admin/tripulantes/addTripulante')
    }catch(err){
        req.flash('error_msg', 'Erro interno')
        res.redirect('admin/painel')
    }
})


router.post('/addTripulante', Admin, async (req, res) => {
    try {
        const novoTripulante = {
            usuarioID: req.user._id,
            tripulanteNome: req.body.tripulanteNome,
            tripulanteGrau: req.body.tripulanteGrau,
            tripulanteDataNascimento: req.body.tripulanteDataNascimento,
            tripulanteNCIR: req.body.tripulanteNCIR,
            tripulanteValidadeCIR: req.body.tripulanteValidadeCIR,
            tripulanteDataCadastro: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            tripulanteDataNumber: Date.now(),
            tripulanteMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }
        await new Tripulante(novoTripulante).save()
        req.flash('success_msg', 'Tripulante cadastrado com sucesso')
        res.redirect('painel')
    } catch (err) {
        req.flash('error_msg', 'Erro ao cadastrar tripulante.')
        res.redirect('painel')
    }
})


router.get('/tripulantesVizu/:id', Admin, async(req, res) => {
    try{
        const tripulantes = await Tripulante.findOne({_id: req.params.id}).lean()
            res.render('admin/tripulantes/tripulantesVizu', 
                {tripulantes: tripulantes
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar tripulante.')
        res.redirect('painel')
    }
})


router.get('/tripulantesEdit/:id', Admin, async(req, res) => {
    try{
        const tripulante = await Tripulante.findOne({_id: req.params.id}).lean()
            res.render('admin/tripulantes/tripulantesEdit', {
                tripulante: tripulante
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar tripulante.')
        res.redirect('painel')
    }
})


router.post('/tripulantesEdit', Admin, async(req, res) => {
    try{
        await Tripulante.updateOne({_id: req.body.id}, {
            tripulanteNome: req.body.tripulanteNome,
            tripulanteGrau: req.body.tripulanteGrau,
            tripulanteDataNascimento: req.body.tripulanteDataNascimento,
            tripulanteNCIR: req.body.tripulanteNCIR,
            tripulanteValidadeCIR: req.body.tripulanteValidadeCIR,
        })
        req.flash('success_msg', 'Tripulante atualizado com sucesso!')
        res.redirect('painel')
    }catch(err){
        req.flash('error_msg', 'Erro ao editar tripulante.')
        res.redirect('painel')
    }
})


router.get('/portos', Admin, async (req, res) => {
    try {
        const portos = await Porto.find().lean().sort({ portoNome: 'asc' })
        res.render('admin/portos/portos',
            {
                portos: portos
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno.')
        res.redirect('painel')
    }
})



router.get('/addPorto', Admin, async (req, res) => {
    try {
        res.render('admin/portos/addPorto')
    } catch (err) {
        req.flash('error_msg', 'Erro interno.')
        res.redirect('painel')
    }
})

router.post('/addPorto', Admin, async (req, res) => {
    try {
        const novoPorto = {
            usuarioID: req.user._id,
            portoNome: req.body.portoNome,
            positionX: req.body.positionX,
            positionZ: req.body.positionZ
        }
        await new Porto(novoPorto).save()
        req.flash('success_msg', 'Porto cadastrado com sucesso!')
        res.redirect('painel')
    } catch (err) {
        req.flash('error_msg', 'Erro ao cadastrar porto.')
        res.redirect('painel')
    }
})


router.get('/portoVizu/:id', Admin, async(req, res) => {
    try{
        const dataHoje = moment(Date.now()).format('DD/MM/YYYY')
        const portos = await Porto.findOne({_id: req.params.id}).lean()
        var despachos = await Despacho.find({despachoPortoEstadia: portos._id}).lean()

         for await(var despacho of despachos){
            var embarcacoes = await Embarcacao.findById(despacho.embarcacao).lean()
            despacho.embarcacao = embarcacoes.embarcacaoNome
        }


            res.render('admin/portos/portoVizu', 
                {portos: portos,
                    despachos: despachos
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar porto.')
        res.redirect('portos')
    }
})




router.get('/portoInfo', Admin, async (req, res) => {
    try {
        const dataHoje = moment(Date.now()).format('YYYY-MM-DD')
        const despachos = await Despacho.find({ depachoMesAnoAtual: dataHoje }).lean()
        const avisoSaidas = await AvisoSaida.find({saidaDataHoraSaida: dataHoje}).lean()
        const avisoEntradas = await AvisoEntrada.find({ entradaMesAnoAtual: dataHoje }).lean()
        var portos = [];

        for await (const saida of avisoSaidas) {
            var portoEmb = {}
            var procurar = await Embarcacao.findOne({ _id: saida.embarcacao }).lean()
            if(procurar.embarcacaoTipo != 'barcaça'){
                portoEmb = { nome: procurar.embarcacaoNome, id: procurar._id.toString(), portoEstadia: saida.saidaPortoSaida.toString() }
            }else{
                portoEmb = { nomeBarcaca: procurar.embarcacaoNome, id: procurar._id.toString(), portoEstadia: saida.saidaPortoSaida.toString() }
            }
            

            var porto = await Porto.findOne({ _id: portoEmb.portoEstadia }).lean()
            porto.embarcacaoNome = portoEmb.nome 
            porto.barcaca = portoEmb.nomeBarcaca
            porto.embarcacaoId = portoEmb.id
            if (portos.some(portoLocal => portoLocal.portoNome == porto.portoNome)) {
                const portoLocal = portos.find(portoLocal => portoLocal.portoNome == porto.portoNome)
                portoLocal.embarcacaoNome.push(porto.embarcacaoNome)
                portoLocal.barcaca.push(porto.barcaca)
                portoLocal.embarcacaoId.push(porto.embarcacaoId)
            } else {
                portos.push({ ...porto, embarcacaoNome: [porto.embarcacaoNome], barcaca: [porto.barcaca], embarcacaoId: [porto.embarcacaoId] })
            }
        }

        const data = portos
        res.json(data)
    } catch (err) {

    }
}) 










module.exports = router