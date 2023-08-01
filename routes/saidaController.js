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
require('../models/Comboio')
require('../models/Correcao')

const Usuario = mongoose.model('usuarios')
const Aviso = mongoose.model('avisos')
const AvisoEntrada = mongoose.model('avisoEntradas')
const Despacho = mongoose.model('despachos')
const AvisoSaida = mongoose.model('avisoSaidas')
const Embarcacao = mongoose.model('embarcacoes')
const Tripulante = mongoose.model('tripulantes')
const Porto = mongoose.model('portos')
const Relatorio = mongoose.model('relatorios')
const Comboio = mongoose.model('comboios')
const Correcao = mongoose.model('correcoes')

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


//----    Rota para formulário de Saída    ----//


router.get('/formulario/avisoSaida', eUser, async (req, res) => {
    try {
        const dataHoje = Date.now()
        const despachos = await Despacho.find({ agenciaID: req.user.agencia, despachoDataValidadeNumber: { $gte: dataHoje } }).lean()
        const tripulantes = await Tripulante.find({ tripulanteValidadeCIRNumber: { $gte: dataHoje } }).lean()
        const portos = await Porto.find().lean()
            res.render('formulario/saidas/avisoSaida',
                {
                    tripulantes: tripulantes,
                    portos: portos,
                    despachos: despachos,
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao mostrar página de adição de Aviso de Saída (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota de postagem para formulário de Saída    ----//


router.post('/formulario/avisoSaida', eUser, async (req, res) => {

    try {

        saidaTripulantesArray = {}

        if(req.body.documentTripulantes != null){
            const cleanString = req.body.documentTripulantes.replace(/[\n' \[\]]/g, '');
            const saidaTripulantes = cleanString.split(',');
    
            const cleanStringFuncao = req.body.documentTripulantesFuncao.replace(/[\n' \[\]]/g, '');
            const saidaTripulantesFuncao = cleanStringFuncao.split(',');
    
            const saidaTripulantesArray = []
    
            if(saidaTripulantes.length === 1){
                for(var i = 0; i < saidaTripulantes.length; i++){
                const tripulante = {
                    id: saidaTripulantes,
                    saidaTripulanteFuncao: saidaTripulantesFuncao
                }
            
                saidaTripulantesArray.push(tripulante)
            }
            }else{
                for(var i = 0; i < saidaTripulantes.length; i++){
                    const tripulante = {
                        id: saidaTripulantes[i],
                        saidaTripulanteFuncao: saidaTripulantesFuncao[i]
                    }
                    saidaTripulantesArray.push(tripulante)
                }
            }
        }

        saidaPassageiros = {}
        somaPassageiros = {}

        if(req.body.documentPassageirosNome != null){
            const clearPassageiros = req.body.documentPassageirosNome
            const passageirosLimpo = clearPassageiros.split(',');
    
            const passageirosNome = req.body.documentPassageirosNome
            const passageirosNascimento = req.body.documentPassageirosNascimento
            const passageirosSexo = req.body.documentPassageirosSexos
    
            const passageirosNomes = passageirosNome.split(',')
            const passageirosNascimentos = passageirosNascimento.split(',')
            const passageirosSexos = passageirosSexo.split(',')
    
            const saidaPassageiros = []
    
            for (var i = 0; i < passageirosLimpo.length; i++){
                const passageiros = {
                    nome: passageirosNomes[i],
                    dataNascimento: passageirosNascimentos[i],
                    sexo: passageirosSexos[i]
                }
                saidaPassageiros.push(passageiros)
            }

            const somaPassageiros = saidaPassageiros.length

        }

        comboioEmbarcacoes = {}

        if(req.body.documentComboio != null){
            const clearEmbNome = req.body.documentComboio.replace(/[\n' \[\]]/g, '');
            const EmbNome = clearEmbNome.split(',');
    
            const clearEmbIncricao = req.body.documentNIncricao.replace(/[\n' \[\]]/g, '');
            const NIncricao = clearEmbIncricao.split(',');
    
            const clearEmbCarga = req.body.documentComboiosCarga.replace(/[\n' \[\]]/g, '');
            const EmbCarga = clearEmbCarga.split(',');
    
            const clearEmbQuantidade = req.body.documentComboiosQuantidadeCarga.replace(/[\n' \[\]]/g, '');
            const EmbQuantidade = clearEmbQuantidade.split(',');
    
            const clearArqueacao = req.body.documentComboiosArqueacaoBruta.replace(/[\n' \[\]]/g, '');
            const EmbArqueacao = clearArqueacao.split(',');
    
            const comboioEmbarcacoes = [];
        
            if(EmbNome.length === 1){
                for (var i = 0; i < EmbNome.length; i++) {
                    const comboioEmbarcacao = {
                    embarcacaoNome: EmbNome[i],
                    NInscricao: NIncricao[i],
                    carga: EmbCarga[i],
                    quantidade: EmbQuantidade[i],
                    arqueacaoBruta: EmbArqueacao[i]
                    };
                    comboioEmbarcacoes.push(comboioEmbarcacao);
                }
            }else{
                for (var i = 0; i < EmbNome.length; i++) {
                    const comboioEmbarcacao = {
                        embarcacaoNome: EmbNome[i],
                        NInscricao: NIncricao[i],
                        carga: EmbCarga[i],
                        quantidade: EmbQuantidade[i],
                        arqueacaoBruta: EmbArqueacao[i]
                    };
                    comboioEmbarcacoes.push(comboioEmbarcacao);
                }
            }
        }

        const agencia = await Usuario.findOne({_id: req.user.agencia}).lean()

        const novoAvisoSaida = {
            usuarioID: req.user._id,
            agenciaID: req.user.agencia,
            agenciaNome: agencia.nome,
            saidaDespacho: req.body.saidaDespacho,
            saidaNprocesso: req.body.saidaNprocesso,
            saidaPortoSaida: req.body.saidaPortoSaida,
            saidaOutroPortoSaida: req.body.saidaOutroPortoSaida,
            saidaDataHoraSaida: req.body.saidaDataHoraSaida,
            saidaPortoDestino: req.body.saidaPortoDestino,
            saidaOutroPortoDestino: req.body.saidaOutroPortoDestino,
            saidaDataHoraChegada: req.body.saidaDataHoraChegada,
            embarcacaoNome: req.body.saidaEmbarcacaoNome,
            embarcacaoTipo: req.body.embarcacaoTipo,
            embarcacaoBandeira: req.body.embarcacaoBandeira,
            embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
            embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
            embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
            embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
            embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
            embarcacaoArmador: req.body.embarcacaoArmador,
            embarcacaoNCRA: req.body.embarcacaoNCRA,
            saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
            saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
            saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
            saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
            saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
            saidaObservacoes: req.body.saidaObservacoes,
            saidaSomaPassageiros: somaPassageiros,
            saidaTripulantes: saidaTripulantesArray,
            saidaPassageiros: saidaPassageiros,
            saidaComboios: comboioEmbarcacoes,
            saidaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            saidaData: Date.now(),
            saidaMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }
        new AvisoSaida(novoAvisoSaida).save()
        req.flash('success_msg', 'Aviso de saida enviado com sucesso')
        res.redirect('/formulario')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao postar Aviso de Saída (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para visualização de Saída    ----//


router.get('/formulario/avisoSaidaVizu/:id', eUser, async (req, res) => {
    try {
        if (req.user.eAdmin) {
            hidden = ''
        } else {
            hidden = 'hidden'
        }
        const avisoSaidas = await AvisoSaida.findOne({ _id: req.params.id }).lean()
        const tripulantes = []
        for await (var saida of avisoSaidas.saidaTripulantes){
            if(saida != null){
                const tripulante = await Tripulante.findOne({_id: saida.id}).lean().catch((err) => {
                    if(err){
                        return null
                    }
                    tripulante.funcao = saida.saidaTripulanteFuncao
                    tripulantes.push(tripulante)
                })
            }
        }        
        const portoSaida = await Porto.findOne({ _id: avisoSaidas.saidaPortoSaida }).lean().catch((err) => {
            if(err){
                return {portoNome: avisoSaidas.saidaOutroPortoSaida}
            }
        })
        const portoDestino = await Porto.findOne({ _id: avisoSaidas.saidaPortoDestino }).lean().catch((err) => {
            if(err){
                return {portoNome: avisoSaidas.saidaOutroPortoDestino}
            }
        })

        const passageiros = []

        avisoSaidas.saidaPassageiros.forEach((el) => {
            passageiros.push(el)
        })

        const comboios = []

        avisoSaidas.saidaComboios.forEach((el) => {
            comboios.push(el)
        })

        const despacho = await Despacho.findOne({ _id: avisoSaidas.saidaDespacho }).lean()
        const correcoes = await Correcao.find({documentoReferente: avisoSaidas._id}).lean()
            res.render('formulario/saidas/avisoSaidaVizu',
                {
                    avisoSaidas: avisoSaidas,
                    tripulantes: tripulantes,
                    despacho: despacho,
                    portoSaida: portoSaida,
                    portoDestino: portoDestino,
                    passageiros: passageiros,
                    comboios: comboios,
                    correcoes: correcoes,
                    hidden: hidden
                })
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao visualizar este Aviso de Saída (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota de listagem de Saídas(user)    ----//


router.get('/saidas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try {
        const avisoSaidas = await AvisoSaida.find({ usuarioID: req.user._id }).limit(5).lean().sort({ saidaData: 'desc' })
            res.render('formulario/saidas/saidas',
                {
                    avisoSaidas: avisoSaidas,
                    admin: admin
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao listar Avisos de Saída (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota de paginação de Saídas     ----//


router.get('/saidas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

    try {
        const contagem = await AvisoSaida.count({ usuarioID: req.user._id })
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
        const avisoSaidas = await AvisoSaida.find({ usuarioID: req.user._id }).skip(skip).limit(limit).lean().sort({ saidaData: 'desc' })
            res.render('formulario/saidas/saidasPage',
                {
                    avisoSaidas: avisoSaidas,
                    nextPage: nextPage,
                    previousPage: previousPage,
                    hidden: hidden,
                    admin: admin
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao paginar Avisos de Saída (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para formulário de edição de Saída    ----//


router.get('/admin/saidasValidate/:id', Admin, async (req, res) => {
    try {
        const avisoSaidas = await AvisoSaida.findOne({ _id: req.params.id }).lean()
        const tripulantesValid = []
        for await (var saida of avisoSaidas.saidaTripulantes){
            const tripulante = await Tripulante.findOne({_id: saida.id}).lean().catch((err) => {
                if(err){
                    throw err
                }
                tripulante.funcao = saida.saidaTripulanteFuncao
                tripulantesValid.push(tripulante)
            })

        }                
        const portoSaida = await Porto.findOne({ _id: avisoSaidas.saidaPortoSaida }).lean().catch((err) => {
            if(err){
                return {portoNome: avisoSaidas.saidaOutroPortoSaida}
            }
        })
        const portoDestino = await Porto.findOne({ _id: avisoSaidas.saidaPortoDestino }).lean().catch((err) => {
            if(err){
                return {portoNome: avisoSaidas.saidaOutroPortoDestino}
            }
        })
        const despachoValid = await Despacho.findOne({ _id: avisoSaidas.saidaDespacho }).lean()

        const tripulantes = await Tripulante.find().lean()
        const portos = await Porto.find().lean()
        const despachos = await Despacho.find().lean()
        const correcoes = await Correcao.find({documentoReferente: avisoSaidas._id}).lean()

            res.render('admin/saidas/avisoSaidaValidate',
                {
                    avisoSaidas: avisoSaidas,
                    tripulantesValid: tripulantesValid,
                    despachoValid: despachoValid,
                    portoSaida: portoSaida,
                    portoDestino: portoDestino,
                    tripulantes: tripulantes,
                    portos: portos,
                    despachos: despachos,
                    correcoes: correcoes
                })
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de edição deste Aviso de Saída (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para postagem de formulário de Saída   ----//


router.post('/admin/saidasValidate', Admin, async (req, res) => {
    try {
        const cleanString = req.body.documentTripulantes.replace(/[\n' \[\]]/g, '');
        const saidaTripulantes = cleanString.split(',');

        const cleanStringFuncao = req.body.documentTripulantesFuncao.replace(/[\n' \[\]]/g, '');
        const saidaTripulantesFuncao = cleanStringFuncao.split(',');

        const saidaTripulantesArray = []

        if(saidaTripulantes.length === 1){
            for(var i = 0; i < saidaTripulantes.length; i++){
            const tripulante = {
                id: saidaTripulantes[i],
                saidaTripulanteFuncao: saidaTripulantesFuncao[i]
            }
        
            saidaTripulantesArray.push(tripulante)
        }
        }else{
            for(var i = 0; i < saidaTripulantes.length; i++){
                const tripulante = {
                    id: saidaTripulantes[i],
                    saidaTripulanteFuncao: saidaTripulantesFuncao[i]
                }
                saidaTripulantesArray.push(tripulante)
            }
        }

        const clearPassageiros = req.body.documentPassageirosNome
        const passageirosLimpo = clearPassageiros.split(',');

        const passageirosNome = req.body.documentPassageirosNome
        const passageirosNascimento = req.body.documentPassageirosNascimento
        const passageirosSexo = req.body.documentPassageirosSexos

        const passageirosNomes = passageirosNome.split(',')
        const passageirosNascimentos = passageirosNascimento.split(',')
        const passageirosSexos = passageirosSexo.split(',')

        const saidaPassageiros = []

        for (var i = 0; i < passageirosLimpo.length; i++){
            const passageiros = {
                nome: passageirosNomes[i],
                dataNascimento: passageirosNascimentos[i],
                sexo: passageirosSexos[i]
            }
            saidaPassageiros.push(passageiros)
        }

        const clearEmbNome = req.body.documentComboio.replace(/[\n' \[\]]/g, '');
        const EmbNome = clearEmbNome.split(',');

        const clearEmbIncricao = req.body.documentNIncricao.replace(/[\n' \[\]]/g, '');
        const NIncricao = clearEmbIncricao.split(',');

        const clearEmbCarga = req.body.documentComboiosCarga.replace(/[\n' \[\]]/g, '');
        const EmbCarga = clearEmbCarga.split(',');

        const clearEmbQuantidade = req.body.documentComboiosQuantidadeCarga.replace(/[\n' \[\]]/g, '');
        const EmbQuantidade = clearEmbQuantidade.split(',');

        const clearArqueacao = req.body.documentComboiosArqueacaoBruta.replace(/[\n' \[\]]/g, '');
        const EmbArqueacao = clearArqueacao.split(',');

        const comboioEmbarcacoes = [];
    
        if(EmbNome.length === 1){
            for (var i = 0; i < EmbNome.length; i++) {
                const comboioEmbarcacao = {
                embarcacaoNome: EmbNome[i],
                NInscricao: NIncricao[i],
                carga: EmbCarga[i],
                quantidade: EmbQuantidade[i],
                arqueacaoBruta: EmbArqueacao[i]
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }else{
            for (var i = 0; i < EmbNome.length; i++) {
                const comboioEmbarcacao = {
                    embarcacaoNome: EmbNome[i],
                    NInscricao: NIncricao[i],
                    carga: EmbCarga[i],
                    quantidade: EmbQuantidade[i],
                    arqueacaoBruta: EmbArqueacao[i]
                };
                comboioEmbarcacoes.push(comboioEmbarcacao);
            }
        }

        const somaPassageiros = saidaPassageiros.length


        await AvisoSaida.updateOne({ _id: req.body.id }, {
            saidaDespacho: req.body.saidaDespacho,
            saidaNprocesso: req.body.saidaNprocesso,
            saidaPortoSaida: req.body.saidaPortoSaida,
            saidaOutroPortoSaida: req.body.saidaOutroPortoSaida,
            saidaDataHoraSaida: req.body.saidaDataHoraSaida,
            saidaPortoDestino: req.body.saidaPortoDestino,
            saidaOutroPortoDestino: req.body.saidaOutroPortoDestino,
            saidaDataHoraChegada: req.body.saidaDataHoraChegada,
            embarcacaoNome: req.body.saidaEmbarcacaoNome,
            embarcacaoTipo: req.body.embarcacaoTipo,
            embarcacaoBandeira: req.body.embarcacaoBandeira,
            embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
            embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
            embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
            embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
            embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
            embarcacaoArmador: req.body.embarcacaoArmador,
            embarcacaoNCRA: req.body.embarcacaoNCRA,
            saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
            saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
            saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
            saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
            saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
            saidaObservacoes: req.body.saidaObservacoes,
            saidaSomaPassageiros: somaPassageiros,
            saidaTripulantes: saidaTripulantesArray,
            saidaPassageiros: saidaPassageiros,
            saidaComboios: comboioEmbarcacoes,

        })
        req.flash('success_msg', 'Aviso de saida enviado com sucesso')
        res.redirect('/admin/painel')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao validar este Aviso de Saída (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para listagem de Saídas(user)    ----//


router.get('/admin/saidas', Admin, (req, res) => {
    AvisoSaida.find().limit(5).lean().sort({ saidaData: 'desc' }).then((avisoSaidas) => {
        res.render('admin/saidas/saidas', 
            { 
                avisoSaidas: avisoSaidas 
            })
    }).catch((err) => {
        req.flash('error_msg', `Erro ao listar Avisos de Saída (${err})`)
        res.redirect('/admin/painel')
    })
})


//----    Rota para paginação de Saídas     ----//


router.get('/admin/saidasPage/:page', Admin, async (req, res) => {
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
        req.flash('error_msg', `Erro ao paginar Avisos de Saída (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para formular PDF de Saída   ----//


router.get('/avisoSaida/:id/pdf', Admin, async (req, res) => {
    try {
        const avisoSaidas = await AvisoSaida.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({ _id: avisoSaidas.embarcacao }).lean()
        const tripulantes = await Tripulante.find({ _id: avisoSaidas.saidaTripulantes }).lean()
        const tripulantesInfos = []
        var tripulantesArray = tripulantes.forEach((el) => {
            tripulantesInfos.push(`<br>` + "Nome: " + el.tripulanteNome + " ")
            tripulantesInfos.push("Grau: " + el.tripulanteGrau + " ")
            tripulantesInfos.push("Numero da CIR: " + el.tripulanteNCIR)
        })

        const html = `
    <style>
       
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          
          h4 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          /* estilizando as caixas de texto */
          input[type="text"] {
            display: block;
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          /* estilizando os rótulos */
          label {
            display: block;
            font-size: 16px;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          /* estilizando as divisões */
          div {
            margin-bottom: 20px;
          }
          
          /* estilizando o formulário como um todo */
          form {
            padding: 20px;
            font-family: Arial, sans-serif;
          }

        </style>
    <form>
        <div>
            <label>N° Pocesso de Despacho</label>
            <input type="text" value="${avisoSaidas.saidaNprocesso}" disabled>
        </div>
        <div>
            <h4>Dados da Partida</h4>
            <div>
                <label>Porto de Saída</label>
                <input type="text" value="${avisoSaidas.saidaPortoSaida}" disabled>
                <label>Data/Hora de Saída</label>
                <input type="text" value="${avisoSaidas.saidaDataHoraSaida}" disabled>
            </div>
            <div>
                <label>Porto de Destino</label>
                <input type="text" value="${avisoSaidas.saidaPortoDestino}" disabled>
                <label>Data/Hora Estimada de Chegada</label>
                <input type="text" value="${avisoSaidas.saidaDataHoraChegada}" disabled>
            </div>
            <div>
            <h4>Dados da Embarcação</h4>
                <div>
                    <label>Nome da Embarcação</label>
                    <input type="text" value="${embarcacoes.embarcacaoNome}" disabled>
                    <label>Tipo da Embarcação</label>
                    <input type="text" value="${embarcacoes.embarcacaoTipo}" disabled>
                </div>
                <div>
                    <label>Bandeira</label>
                    <input type="text" value="${embarcacoes.embarcacaoBandeira}" disabled>
                    <label>N° Inscrição na Autoridade Marítima do Brasil</label>
                    <input type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" disabled>
                </div>
                <div>
                    <label>Arqueação Buta</label>
                    <input type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" disabled>
                    <label>Tonelagem Porte Bruto</label>
                    <input type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" disabled>
                </div>
        </div>
            <h4 >Dados do Representante da Embarcação</h4>
            <div>
                <label>Nome</label>
                <input type="text" value="${avisoSaidas.saidaNomeRepresentanteEmbarcacao}" disabled>
            </div>
            <div>
                <label>CPF/CNPJ</label>
                <input type="text" value="${avisoSaidas.saidaCPFCNPJRepresentanteEmbarcacao}" disabled>
                <label>Telefone</label>
                <input type="text" value="${avisoSaidas.saidaTelefoneRepresentanteEmbarcacao}" disabled>
            </div>
            <div>
                <label>Endereço</label>
                <input type="text" value="${avisoSaidas.saidaEnderecoRepresentanteEmbarcacao}" disabled>
                <label>Email</label>
                <input type="text" value="${avisoSaidas.saidaEmailRepresentanteEmbarcacao}" disabled>
            </div>
        </div>
        <div>
            <h4>Observações</h4>
            <div>
                <input type="text" value="${avisoSaidas.saidaObservacoes}" disabled>
            </div>
        </div>
        <div>
            <div>
                <h4>Lista de Tripulantes</h4>
                ${tripulantesInfos}
            </div>
        </div>
        <div>
            <div>
                <h4>Lista de Passageiros</h4>
                <input type="text" value="${avisoSaidas.saidaPassageiros}" disabled>
                </div>
            </div>
            <div>
                <label>Somatório de Passageiros</label>
                <input value="${avisoSaidas.saidaSomaPassageiros}" type="number" disabled>
            </div>
            <div>
            <div>
                <h4>Lista de Comboios</h4>
                <input type="text" value="${avisoSaidas.saidaComboios}" disabled>
            </div>
            </div>
            <div>
                <label>Embarcação</label>
                <input value="${embarcacoes.embarcacaoNome}" disabled>
            </div>
        </form>
        `

        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err);
            res.attachment(`${avisoSaidas.saidaNprocesso}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);

        });
    } catch (err) {
        req.flash('error_msg', `Erro ao gerar PDF deste Aviso de Saída (${err})`)
        res.redirect('/admin/painel')
    }
})


module.exports = router