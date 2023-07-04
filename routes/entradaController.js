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


//----    Rota para formular Entrada    ----//


router.get('/formulario/avisoEntrada', eUser, async (req, res) => {
    try {
        const dataHoje = Date.now()
        const despachos = await Despacho.find({ agenciaID: req.user.agencia, despachoDataValidadeNumber: { $gte: dataHoje } }).lean()
        const tripulantes = await Tripulante.find({ tripulanteValidadeCIRNumber: { $gte: dataHoje } }).lean()
        const portos = await Porto.find().lean()
            res.render('formulario/entradas/avisoEntrada', 
                {
                    tripulantes: tripulantes,
                    portos: portos,
                    despachos: despachos,
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao mostrar formulário de adição de Aviso de Entrada (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para postagem de Entrada   ----//


router.post('/formulario/avisoEntrada', eUser, async (req, res) => {
    try {
        const cleanString = req.body.documentTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const entradaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

        const cleanStringFuncao = req.body.documentTripulantesFuncao.replace(/[\n' \[\]]/g, '');
        const entradaTripulantesFuncao = cleanStringFuncao.split(',');

        const entradaTripulantesArray = []

        if(tripulantes.length === 1){
            for(var i = 0; i < tripulantes.length; i++){
            const tripulante = {
                id: entradaTripulantes,
                entradaTripulanteFuncao: entradaTripulantesFuncao
            }
        
            entradaTripulantesArray.push(tripulante)
        }
        }else{
            for(var i = 0; i < tripulantes.length; i++){
                const tripulante = {
                    id: entradaTripulantes[i],
                    entradaTripulanteFuncao: entradaTripulantesFuncao[i]
                }
                entradaTripulantesArray.push(tripulante)
            }
        }
        console.log(cleanStringFuncao)
        const clearPassageiros = req.body.documentPassageirosNome
        const passageirosLimpo = clearPassageiros.split(',');

        const passageirosNome = req.body.documentPassageirosNome
        const passageirosNascimento = req.body.documentPassageirosNascimento
        const passageirosSexo = req.body.documentPassageirosSexos

        const passageirosNomes = passageirosNome.split(',')
        const passageirosNascimentos = passageirosNascimento.split(',')
        const passageirosSexos = passageirosSexo.split(',')

        const entradaPassageiros = []

        for (var i = 0; i < passageirosLimpo.length; i++){
            const passageiros = {
                nome: passageirosNomes[i],
                dataNascimento: passageirosNascimentos[i],
                sexo: passageirosSexos[i]
            }
            entradaPassageiros.push(passageiros)
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

        console.log(entradaPassageiros)
        const novoAvisoEntrada = {
            usuarioID: req.user._id,
            agenciaID: req.user.agencia,
            entradaDespacho: req.body.entradaDespacho,
            entradaNprocesso: req.body.entradaNprocesso,
            entradaPortoChegada: req.body.entradaPortoChegada,
            entradaOutroPortoChegada: req.body.entradaOutroPortoChegada,
            entradaDataHoraChegada: req.body.entradaDataHoraChegada,
            entradaPosicaoPortoAtual: req.body.entradaPosicaoPortoAtual,
            entradaPortoOrigem: req.body.entradaPortoOrigem,
            entradaOutroPortoOrigem: req.body.entradaOutroPortoOrigem,
            entradaPortoDestino: req.body.entradaPortoDestino,
            entradaOutroPortoDestino: req.body.entradaOutroPortoDestino,
            entradaDataHoraEstimadaSaida: req.body.entradaDataHoraEstimadaSaida,
            embarcacaoNome: req.body.entradaEmbarcacaoNome,
            embarcacaoTipo: req.body.embarcacaoTipo,
            embarcacaoBandeira: req.body.embarcacaoBandeira,
            embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
            embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
            embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
            embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
            embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
            embarcacaoArmador: req.body.embarcacaoArmador,
            embarcacaoNCRA: req.body.embarcacaoNCRA,
            entradaNomeRepresentanteEmbarcacao: req.body.entradaNomeRepresentanteEmbarcacao,
            entradaCPFCNPJRepresentanteEmbarcacao: req.body.entradaCPFCNPJRepresentanteEmbarcacao,
            entradaTelefoneRepresentanteEmbarcacao: req.body.entradaTelefoneRepresentanteEmbarcacao,
            entradaEnderecoRepresentanteEmbarcacao: req.body.entradaEnderecoRepresentanteEmbarcacao,
            entradaEmailRepresentanteEmbarcacao: req.body.entradaEmailRepresentanteEmbarcacao,
            entradaDadosUltimaInpecaoNaval: req.body.entradaDadosUltimaInpecaoNaval,
            entradaDeficienciasRetificadasPorto: req.body.entradaDeficienciasRetificadasPorto,
            entradaTransporteCagaPerigosa: req.body.entradaTransporteCagaPerigosa,
            entradaObservacoes: req.body.entradaObservacoes,
            entradaTripulantes: entradaTripulantesArray,
            entradaPassageiros: entradaPassageiros,
            entradaComboios: comboioEmbarcacoes,
            entradaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            entradaData: Date.now(),
            entradaMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }
        new AvisoEntrada(novoAvisoEntrada).save()
        req.flash('success_msg', 'Aviso de entrada enviado com sucesso')
        res.redirect('/formulario')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao postar Aviso de Entrada (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para visualização da Entrada   ----//


router.get('/formulario/avisoEntradavizu/:id', eUser, async (req, res) => {
    try {
        if (req.user.eAdmin) {
            hidden = ''
        } else {
            hidden = 'hidden'
        }
        const avisoEntradas = await AvisoEntrada.findOne({ _id: req.params.id }).lean()
        const tripulantes = []
        for await (var entrada of avisoEntradas.entradaTripulantes){
            const tripulante = await Tripulante.findOne({_id: entrada.id}).lean()
            tripulante.funcao = entrada.entradaTripulanteFuncao
            tripulantes.push(tripulante)
        }
        const embarcacoes = await Embarcacao.findOne({ _id: avisoEntradas.embarcacao }).lean()
        const portoChegada = await Porto.findOne({ _id: avisoEntradas.entradaPortoChegada}).lean().catch((err) => {
                if(err){
                    return {portoNome: avisoEntradas.entradaOutroPortoChegada}
                }
              })
        const portoOrigem = await Porto.findOne({_id: avisoEntradas.entradaPortoOrigem}).lean().catch((err) => {
            if(err){
                return {portoNome: avisoEntradas.entradaOutroPortoOrigem}
            }
        })
        const portoDestino = await Porto.findOne({_id: avisoEntradas.entradaPortoDestino}).lean().catch((err) => {
            if(err){
                return {portoNome: avisoEntradas.entradaOutroPortoDestino}
            }
        })
        const despacho = await Despacho.findOne({ _id: avisoEntradas.entradaDespacho }).lean()
        const comboios = await Comboio.findOne({ _id: avisoEntradas.entradaComboios }).lean()
            res.render('formulario/entradas/avisoEntradaVizu', 
                {
                    avisoEntradas: avisoEntradas,
                    tripulantes: tripulantes,
                    embarcacoes: embarcacoes,
                    despacho: despacho,
                    comboios: comboios,
                    portoChegada: portoChegada,
                    portoOrigem: portoOrigem,
                    portoDestino: portoDestino,
                    hidden: hidden
                })
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao visualizar este Aviso de Entrada (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para listagem de Entradas(user)   ----//


router.get('/entradas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try {
        const avisoEntradas = await AvisoEntrada.find({ usuarioID: req.user._id }).limit(5).lean().sort({ entradaData: 'desc' })
            res.render('formulario/entradas/entradas',
                {
                    avisoEntradas: avisoEntradas,
                    admin: admin
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao listar Avisos de Entrada (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para paginação de Entradas(user)   ----//


router.get('/entradas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

    try {
        const contagem = await AvisoEntrada.count({ usuarioID: req.user._id })
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
        const avisoEntradas = await AvisoEntrada.find({ usuarioID: req.user._id }).skip(skip).limit(limit).lean().sort({ entradaData: 'desc' })
            res.render('formulario/entradas/entradasPage',
                {
                    avisoEntradas: avisoEntradas,
                    nextPage: nextPage,
                    previousPage: previousPage,
                    hidden: hidden,
                    admin: admin
                })
    } catch (err) {
        req.flash('error_msg', `Erro ao paginar Avisos de Entrada (${err})`)
        res.redirect('/formulario')
    }
})


//----    Rota para validação de formulário de validação de Entrada    ----//


router.get('/admin/entradasValidate/:id', Admin, async (req, res) => {
    try {
        const avisoEntradas = await AvisoEntrada.findOne({ _id: req.params.id }).lean()
        const tripulantesValid = []
        for await (var entrada of avisoEntradas.entradaTripulantes){
            const tripulante = await Tripulante.findOne({_id: entrada.id}).lean()
            tripulante.funcao = entrada.entradaTripulanteFuncao
            tripulantesValid.push(tripulante)
        }
        const embarcacoesValid = await Embarcacao.findOne({ _id: avisoEntradas.embarcacao }).lean()
        const portoChegada = await Porto.findOne({ _id: avisoEntradas.entradaPortoChegada}).lean().catch((err) => {
            if(err){
                return {portoNome: avisoEntradas.entradaOutroPortoChegada}
            }
          })
        const portoOrigem = await Porto.findOne({_id: avisoEntradas.entradaPortoOrigem}).lean().catch((err) => {
            if(err){
                return {portoNome: avisoEntradas.entradaOutroPortoOrigem}
            }
        })
        const portoDestino = await Porto.findOne({_id: avisoEntradas.entradaPortoDestino}).lean().catch((err) => {
            if(err){
                return {portoNome: avisoEntradas.entradaOutroPortoDestino}
            }
        })        
        const despachoValid = await Despacho.findOne({ _id: avisoEntradas.entradaDespacho }).lean()
        const comboiosValid = await Comboio.findOne({_id: avisoEntradas.entradaComboios }).lean()

        const tripulantes = await Tripulante.find().lean()
        const embarcacoes = await Embarcacao.find().lean()
        const portos = await Porto.find().lean()
        const despachos = await Despacho.find().lean()
        const comboios = await Comboio.find().lean()
            res.render('admin/entradas/avisoEntradaValidate', 
                {
                    avisoEntradas: avisoEntradas,
                    tripulantesValid: tripulantesValid,
                    embarcacoesValid: embarcacoesValid,
                    despachoValid: despachoValid,
                    portoChegada: portoChegada,
                    portoOrigem: portoOrigem,
                    portoDestino: portoDestino,
                    tripulantes: tripulantes,
                    comboiosValid: comboiosValid,
                    embarcacoes: embarcacoes,
                    portos: portos,
                    despachos: despachos,
                    comboios: comboios
                })
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao mostrar página de validação de Aviso de Entrada (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota para postagem de validação de Entrada   ----//


router.post('/admin/entradasValidate', Admin, async (req, res) => {
    try {
        const cleanString = req.body.documentTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const entradaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

        const cleanStringFuncao = req.body.documentTripulantesFuncao.replace(/[\n' \[\]]/g, '');
        const entradaTripulantesFuncao = cleanStringFuncao.split(',');

        const entradaTripulantesArray = []

        if(tripulantes.length === 1){
            for(var i = 0; i < tripulantes.length; i++){
            const tripulante = {
                id: entradaTripulantes,
                entradaTripulanteFuncao: entradaTripulantesFuncao
            }
        
            entradaTripulantesArray.push(tripulante)
        }
        }else{
            for(var i = 0; i < tripulantes.length; i++){
                const tripulante = {
                    id: entradaTripulantes[i],
                    entradaTripulanteFuncao: entradaTripulantesFuncao[i]
                }
                entradaTripulantesArray.push(tripulante)
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

        const entradaPassageiros = []

        for (var i = 0; i < passageirosLimpo.length; i++){
            const passageiros = {
                nome: passageirosNomes[i],
                dataNascimento: passageirosNascimentos[i],
                sexo: passageirosSexos[i]
            }
            entradaPassageiros.push(passageiros)
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

        await AvisoEntrada.updateOne({ _id: req.body.id }, {
            entradaDespacho: req.body.entradaDespacho,
            entradaNprocesso: req.body.entradaNprocesso,
            entradaPortoChegada: req.body.entradaPortoChegada,
            entradaOutroPortoChegada: req.body.entradaOutroPortoChegada,
            entradaDataHoraChegada: req.body.entradaDataHoraChegada,
            entradaPosicaoPortoAtual: req.body.entradaPosicaoPortoAtual,
            entradaPortoOrigem: req.body.entradaPortoOrigem,
            entradaOutroPortoOrigem: req.body.entradaOutroPortoOrigem,
            entradaPortoDestino: req.body.entradaPortoDestino,
            entradaOutroPortoDestino: req.body.entradaOutroPortoDestino,
            entradaDataHoraEstimadaSaida: req.body.entradaDataHoraEstimadaSaida,
            embarcacaoNome: req.body.entradaEmbarcacaoNome,
            embarcacaoTipo: req.body.embarcacaoTipo,
            embarcacaoBandeira: req.body.embarcacaoBandeira,
            embarcacaoNInscricaoautoridadeMB: req.body.embarcacaoNInscricaoautoridadeMB,
            embarcacaoArqueacaoBruta: req.body.embarcacaoArqueacaoBruta,
            embarcacaoComprimentoTotal: req.body.embarcacaoComprimentoTotal,
            embarcacaoTonelagemPorteBruto: req.body.embarcacaoTonelagemPorteBruto,
            embarcacaoCertificadoRegistroAmador: req.body.embarcacaoCertificadoRegistroAmador,
            embarcacaoArmador: req.body.embarcacaoArmador,
            embarcacaoNCRA: req.body.embarcacaoNCRA,
            entradaNomeRepresentanteEmbarcacao: req.body.entradaNomeRepresentanteEmbarcacao,
            entradaCPFCNPJRepresentanteEmbarcacao: req.body.entradaCPFCNPJRepresentanteEmbarcacao,
            entradaTelefoneRepresentanteEmbarcacao: req.body.entradaTelefoneRepresentanteEmbarcacao,
            entradaEnderecoRepresentanteEmbarcacao: req.body.entradaEnderecoRepresentanteEmbarcacao,
            entradaEmailRepresentanteEmbarcacao: req.body.entradaEmailRepresentanteEmbarcacao,
            entradaDadosUltimaInpecaoNaval: req.body.entradaDadosUltimaInpecaoNaval,
            entradaDeficienciasRetificadasPorto: req.body.entradaDeficienciasRetificadasPorto,
            entradaTransporteCagaPerigosa: req.body.entradaTransporteCagaPerigosa,
            entradaObservacoes: req.body.entradaObservacoes,
            entradaTripulantes: entradaTripulantesArray,
            entradaPassageiros: entradaPassageiros,
            entradaComboios: comboioEmbarcacoes,
            entradaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            entradaData: Date.now(),
            entradaMesAnoAtual: moment(Date.now()).format('MM/YYYY')

        })
        req.flash('success_msg', 'Aviso de entrada validado com sucesso')
        res.redirect('/admin/painel')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', `Erro ao validar Aviso de Entrada (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de listagem de Entradas(admin)    ----//


router.get('/admin/entradas', Admin, async (req, res) => {
    try{
        const avisoEntradas = await AvisoEntrada.find().limit(5).lean().sort({ entradaData: 'desc' })
            res.render('admin/entradas/entradas', 
                { 
                    avisoEntradas: avisoEntradas 
                })
    }catch(err){
        req.flash('error_msg', `Erro ao listar Avisos de Entrada (${err})`)
        res.redirect('/admin/painel')
    }
})


//----    Rota de paginação de Entradas(admin)     ----//


router.get('/admin/entradasPage/:page', Admin, async (req, res) => {
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
        req.flash('error_msg', `Erro ao paginar Avisos de Entrada (${err})`)
        res.redirect('/admin/painel')
    }
})


//----   Rota de formulação de PDF da Entrada   ----//


router.get('/avisoEntrada/:id/pdf', Admin, async (req, res) => {
    try {
        const avisoEntradas = await AvisoEntrada.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({ _id: avisoEntradas.embarcacao }).lean()
        const tripulantes = await Tripulante.find({ _id: avisoEntradas.entradaTripulantes }).lean()
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
              <input type="text" value="${avisoEntradas.entradaNprocesso}" >
          </div>
          <div>
              <h4>Dados da Estadia</h4>
              <div>
                  <label>Porto de chegada</label>
                  <input type="text" value="${avisoEntradas.entradaPortoChegada}" >
                  <label>Data/Hora de chegada</label>
                  <input type="text" value="${avisoEntradas.entradaDataHoraChegada}" >
              </div>
              <div>
                  <label>Posição no Porto Atual</label>
                  <input type="text" value="${avisoEntradas.entradaPosicaoPortoAtual}" >
              </div>
              <div>
                  <label>Porto de Origem</label>
                  <input type="text" value="${avisoEntradas.entradaPortoOrigem}" >
              </div>
              <div>
                  <label>Porto de Destino</label>
                  <input type="text" value="${avisoEntradas.entradaPortoDestino}" >
                  <label>Data/Hora Estimada de Saída para Porto de destino</label>
                  <input type="text" value="${avisoEntradas.entradaDataHoraEstimadaSaida}" >
              </div>
          <div>
              <h4 class="text-center">Dados da Embarcação</h4>
                  <div>
                      <label>Nome da Embarcação</label>
                      <input type="text" value="${embarcacoes.embarcacaoNome}" >
                      <label>Tipo da Embarcação</label>
                      <input type="text" value="${embarcacoes.embarcacaoTipo}" >
                  </div>
                  <div>
                      <label>Bandeira</label>
                      <input type="text" value="${embarcacoes.embarcacaoBandeira}" >
                      <label>N° Inscrição na Autoridade Marítima do Brasil</label>
                      <input type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" >
                  </div>
                  <div>
                      <label>Arqueação Buta</label>
                      <input type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" >
                      <label>Tonelagem Porte Bruto</label>
                      <input type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" >
                  </div>
          </div>
              <h4>Dados do Representante da Embarcação</h4>
              <div>
                  <label>Nome</label>
                  <input type="text" value="${avisoEntradas.entradaNomeRepresentanteEmbarcacao}" >
              </div>
              <div>
                  <label>CPF/CNPJ</label>
                  <input type="text" value="${avisoEntradas.entradaCPFCNPJRepresentanteEmbarcacao}" >
                  <label>Telefone</label>
                  <input type="text" value="${avisoEntradas.entradaTelefoneRepresentanteEmbarcacao}" >
              </div>
              <div>
                  <label>Endereço</label>
                  <input type="text" value="${avisoEntradas.entradaEnderecoRepresentanteEmbarcacao}" >
                  <label>Email</label>
                  <input type="text" value="${avisoEntradas.entradaEmailRepresentanteEmbarcacao}" >
              </div>
          </div>
          <div>
              <h4>Informações Complementares</h4>
              <div>
                  <label>Dados da Ultima Inspeção Naval</label>
                  <input type="text" value="${avisoEntradas.entradaDadosUltimaInpecaoNaval}" >
              </div>
              <div>
                  <label>Deficiências a serem retificadas neste porto?</label>
                  <input type="text" value="${avisoEntradas.entradaDeficienciasRetificadasPorto}" >
              </div>
              <div>
                  <label>Transporte de Carga Perigosa</label>
                  <input type="text" value="${avisoEntradas.entradaTransporteCagaPerigosa}" >
              </div>
          </div>
          <div>
              <h4>Observações</h4>
              <div>
                  <input type="text" value="${avisoEntradas.entradaObservacoes}" >
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
                  <input type="text" value="${avisoEntradas.entradaPassageiros}" >
                  </div>
              </div>
              <div>
              <div>
                  <h4>Lista de Comboios</h4>
                  <input type="text" value="${avisoEntradas.entradaComboios}" >
              </div>
              </div>
              <div>
                  <label>Embarcação</label>
                  <input value="${embarcacoes.embarcacaoNome}" >
              </div>
  </form>

 `
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err);
            res.attachment(`${avisoEntradas.entradaNprocesso}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);

        });
    } catch (err) {
        req.flash('error_msg', `Erro ao gerar PDF deste Aviso de Entrada (${err})`)
        res.redirect('/admin/painel')
    }
})


module.exports = router