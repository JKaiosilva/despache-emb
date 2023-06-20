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


//----    Rota para formulário de Saída    ----//


router.get('/formulario/avisoSaida', eUser, async (req, res) => {
    try {
        const dataHoje = Date.now()
        const despachos = await Despacho.find({ usuarioID: req.user._id, despachoDataValidadeNumber: { $gte: dataHoje } }).lean()
        const embarcacoes = await Embarcacao.find({ usuarioID: req.user._id, embarcacaoValidadeNumber: { $gte: dataHoje } }).lean()
        const tripulantes = await Tripulante.find({ tripulanteValidadeCIRNumber: { $gte: dataHoje } }).lean()
        const portos = await Porto.find().lean()
        const comboios = await Comboio.find({usuarioID: req.user._id}).lean()
        res.render('formulario/saidas/avisoSaida',
            {
                embarcacoes: embarcacoes,
                tripulantes: tripulantes,
                portos: portos,
                despachos: despachos,
                comboios: comboios
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})


//----    Rota de postagem para formulário de Saída    ----//


router.post('/formulario/avisoSaida', eUser, async (req, res) => {

    try {
        const cleanString = req.body.saidaTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const avisoSaidaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

        const clearPassageiros = req.body.saidaPassageirosNome
        const passageirosLimpo = clearPassageiros.split(',');

        const passageirosNome = req.body.saidaPassageirosNome
        const passageirosNascimento = req.body.saidaPassageirosNascimento
        const passageirosSexo = req.body.saidaPassageirosSexos

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

        const novoAvisoSaida = {
            usuarioID: req.user._id,
            saidaDespacho: req.body.saidaDespacho,
            saidaNprocesso: req.body.saidaNprocesso,
            saidaPortoSaida: req.body.saidaPortoSaida,
            saidaOutroPortoSaida: req.body.saidaOutroPortoSaida,
            saidaDataHoraSaida: req.body.saidaDataHoraSaida,
            saidaPortoDestino: req.body.saidaPortoDestino,
            saidaOutroPortoDestino: req.body.saidaOutroPortoDestino,
            saidaDataHoraChegada: req.body.saidaDataHoraChegada,
            saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
            saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
            saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
            saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
            saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
            saidaObservacoes: req.body.saidaObservacoes,
            saidaSomaPassageiros: req.body.saidaSomaPassageiros,
            saidaTripulantes: avisoSaidaTripulantes,
            saidaPassageiros: saidaPassageiros,
            saidaComboios: req.body.saidaComboios,
            saidaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            embarcacao: req.body.embarcacao,
            saidaData: Date.now(),
            saidaMesAnoAtual: moment(Date.now()).format('MM/YYYY')
        }
        new AvisoSaida(novoAvisoSaida).save()
        req.flash('success_msg', 'Aviso de saida enviado com sucesso')
        res.redirect('/')
    } catch (err) {
        req.flash('error_msg', 'Erro interno, tente novamente')
        res.redirect('/')
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
        const tripulantes = await Tripulante.find({ _id: avisoSaidas.saidaTripulantes }).lean()
        const embarcacoes = await Embarcacao.findOne({ _id: avisoSaidas.embarcacao }).lean()
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
        const despacho = await Despacho.findOne({ _id: avisoSaidas.saidaDespacho }).lean()
        const comboios = await Comboio.findOne({_id: avisoSaidas.saidaComboios}).lean()

        res.render('formulario/saidas/avisoSaidaVizu',
            {
                avisoSaidas: avisoSaidas,
                embarcacoes: embarcacoes,
                tripulantes: tripulantes,
                despacho: despacho,
                comboios: comboios,
                portoSaida: portoSaida,
                portoDestino: portoDestino,
                hidden: hidden
            })
    } catch (err) {
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
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
        req.flash('error_msg', 'Erro ao mostrar página')
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
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


//----    Rota para formulário de edição de Saída    ----//


router.get('/admin/saidasValidate/:id', Admin, async (req, res) => {
    try {
        const avisoSaidas = await AvisoSaida.findOne({ _id: req.params.id }).lean()
        const tripulantesValid = await Tripulante.find({ _id: avisoSaidas.saidaTripulantes }).lean()
        const embarcacaoValid = await Embarcacao.findOne({ _id: avisoSaidas.embarcacao }).lean()
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
        const comboiosValid = await Comboio.findOne({_id: avisoSaidas.saidaComboios}).lean()

        const tripulantes = await Tripulante.find().lean()
        const embarcacoes = await Embarcacao.find().lean()
        const portos = await Porto.find().lean()
        const despachos = await Despacho.find().lean()
        const comboios = await Comboio.find().lean()

        res.render('admin/saidas/avisoSaidaValidate',
            {
                avisoSaidas: avisoSaidas,
                tripulantesValid: tripulantesValid,
                embarcacaoValid: embarcacaoValid,
                despachoValid: despachoValid,
                portoSaida: portoSaida,
                portoDestino: portoDestino,
                comboiosValid: comboiosValid,
                tripulantes: tripulantes,
                embarcacoes: embarcacoes,
                portos: portos,
                despachos: despachos,
                comboios: comboios
            })

    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar aviso de saida!')
        res.redirect('/')
    }
})


//----    Rota para postagem de formulário de Saída   ----//


router.post('/admin/saidasValidate', Admin, async (req, res) => {
    try {
        const cleanString = req.body.saidaTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const avisoSaidaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

        const clearPassageiros = req.body.saidaPassageirosNome
        const passageirosLimpo = clearPassageiros.split(',');

        const passageirosNome = req.body.saidaPassageirosNome
        const passageirosNascimento = req.body.saidaPassageirosNascimento
        const passageirosSexo = req.body.saidaPassageirosSexos

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

        await AvisoSaida.updateOne({ _id: req.body.id }, {
            saidaDespacho: req.body.saidaDespacho,
            saidaNprocesso: req.body.saidaNprocesso,
            saidaPortoSaida: req.body.saidaPortoSaida,
            saidaOutroPortoSaida: req.body.saidaOutroPortoSaida,
            saidaDataHoraSaida: req.body.saidaDataHoraSaida,
            saidaPortoDestino: req.body.saidaPortoDestino,
            saidaOutroPortoDestino: req.body.saidaOutroPortoDestino,
            saidaDataHoraChegada: req.body.saidaDataHoraChegada,
            saidaNomeRepresentanteEmbarcacao: req.body.saidaNomeRepresentanteEmbarcacao,
            saidaCPFCNPJRepresentanteEmbarcacao: req.body.saidaCPFCNPJRepresentanteEmbarcacao,
            saidaTelefoneRepresentanteEmbarcacao: req.body.saidaTelefoneRepresentanteEmbarcacao,
            saidaEnderecoRepresentanteEmbarcacao: req.body.saidaEnderecoRepresentanteEmbarcacao,
            saidaEmailRepresentanteEmbarcacao: req.body.saidaEmailRepresentanteEmbarcacao,
            saidaObservacoes: req.body.saidaObservacoes,
            saidaSomaPassageiros: req.body.saidaSomaPassageiros,
            saidaTripulantes: avisoSaidaTripulantes,
            saidaPassageiros: saidaPassageiros,
            saidaComboios: req.body.saidaComboios,
            embarcacao: req.body.embarcacao

        })
        req.flash('success_msg', 'Aviso de saida enviado com sucesso')
        res.redirect('/')
    } catch (err) {
        console.log(err)
        req.flash('error_msg', 'Erro interno ao validar aviso de saida!')
        res.redirect('/')
    }
})


//----    Rota para listagem de Saídas(user)    ----//


router.get('/admin/saidas', Admin, (req, res) => {
    AvisoSaida.find().limit(5).lean().sort({ saidaData: 'desc' }).then((avisoSaidas) => {
        res.render('admin/saidas/saidas', { avisoSaidas: avisoSaidas })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar avisos de saida!')
        res.redirect('/')
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
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/')
    }
})


module.exports = router