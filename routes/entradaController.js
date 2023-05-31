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

const moment = require('moment')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const pdf = require('html-pdf')
const axios = require('axios')
require('dotenv').config();
const cheerio = require('cheerio')
const bcrypt = require('bcryptjs')


router.get('/admin/entradas', Admin, (req, res) => {
    AvisoEntrada.find().limit(5).lean().sort({ entradaData: 'desc' }).then((avisoEntradas) => {
        res.render('admin/entradas/entradas', { avisoEntradas: avisoEntradas })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar avisos de entrada!')
        res.redirect('/')
    })
})


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
        req.flash('error_msg', 'Erro interno ao mostrar avisos de entrada!')
        res.redirect('/')
    }
})


router.get('/admin/entradasValidate/:id', Admin, async(req, res) => {
    try{
        const avisoEntradas = await AvisoEntrada.findOne({_id: req.params.id}).lean()
        const tripulantesValid = await Tripulante.find({_id: avisoEntradas.entradaTripulantes}).lean()
        const embarcacoesValid = await Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean()
        const portosValid = await Porto.findOne({_id: avisoEntradas.entradaPortoChegada}).lean()
        const despachoValid = await Despacho.findOne({_id: avisoEntradas.entradaDespacho}).lean()

        const tripulantes = await Tripulante.find().lean()
        const embarcacoes = await Embarcacao.find().lean()
        const portos = await Porto.find().lean()
        const despachos = await Despacho.find().lean()


            res.render('admin/entradas/avisoEntradaValidate',
                {avisoEntradas: avisoEntradas,
                    tripulantesValid: tripulantesValid,
                        embarcacoesValid: embarcacoesValid,
                            despachoValid: despachoValid,
                                portosValid: portosValid,
                                    tripulantes: tripulantes,
                                        embarcacoes: embarcacoes,
                                            portos: portos,
                                                despachos: despachos
                })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar aviso de entrada!')
        res.redirect('/')
    }
})


router.post('/admin/entradasValidate', Admin, async(req, res) => {
    try{
        const cleanString = req.body.entradaTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const entradaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));
    
        await AvisoEntrada.updateOne({_id: req.body.id}, {
            entradaDespacho: req.body.entradaDespacho,
            entradaNprocesso: req.body.entradaNprocesso,
            entradaPortoChegada: req.body.entradaPortoChegada,
            entradaDataHoraChegada: req.body.entradaDataHoraChegada,
            entradaPosicaoPortoAtual: req.body.entradaPosicaoPortoAtual,
            entradaPortoOrigem: req.body.entradaPortoOrigem,
            entradaPortoDestino: req.body.entradaPortoDestino,
            entradaDataHoraEstimadaSaida: req.body.entradaDataHoraEstimadaSaida,
            entradaNomeRepresentanteEmbarcacao: req.body.entradaNomeRepresentanteEmbarcacao,
            entradaCPFCNPJRepresentanteEmbarcacao: req.body.entradaCPFCNPJRepresentanteEmbarcacao,
            entradaTelefoneRepresentanteEmbarcacao: req.body.entradaTelefoneRepresentanteEmbarcacao,
            entradaEnderecoRepresentanteEmbarcacao: req.body.entradaEnderecoRepresentanteEmbarcacao,
            entradaEmailRepresentanteEmbarcacao: req.body.entradaEmailRepresentanteEmbarcacao,
            entradaDadosUltimaInpecaoNaval: req.body.entradaDadosUltimaInpecaoNaval,
            entradaDeficienciasRetificadasPorto: req.body.entradaDeficienciasRetificadasPorto,
            entradaTransporteCagaPerigosa: req.body.entradaTransporteCagaPerigosa,
            entradaObservacoes: req.body.entradaObservacoes,
            entradaTripulantes: entradaTripulantes,
            entradaPassageiros: "Nome: "+ req.body.entradaPassageirosNome+
            " || Data de Nascimento: " + req.body.entradaPassageirosDataNascimento+
            " || Sexo: " + req.body.entradaPassageirosSexo,
            entradaComboios: "Nome: "+ req.body.entradaComboiosNome+
            " || Numero de Inscrição: "+ req.body.entradaComboiosNIncricao+
            " || Arqueação Bruta: "+ req.body.entradaComboiosArqueacaoBruta+
            " || Carga: "+ req.body.entradaComboiosCarga+
            " || Quantidade da Caga: "+ req.body.entradaComboiosQuantidadeCarga,
            entradaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
            embarcacao: req.body.embarcacao,
            entradaData: Date.now(),
            entradaMesAnoAtual: moment(Date.now()).format('MM/YYYY')

        })
            req.flash('success_msg', 'Aviso de entrada validado com sucesso')
            res.redirect('/')
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao validar despachos!')
        res.redirect('painel')
    }
})


router.get('/formulario/avisoEntradavizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const avisoEntradas = await AvisoEntrada.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: avisoEntradas.entradaTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean()
        const portos = await Porto.findOne({_id: avisoEntradas.entradaPortoChegada}).lean()
        const despacho = await Despacho.findOne({_id: avisoEntradas.entradaDespacho}).lean()

            res.render('formulario/entradas/avisoEntradaVizu',
                {avisoEntradas: avisoEntradas,
                    tripulantes: tripulantes,
                        embarcacoes: embarcacoes,
                            despacho: despacho,
                                portos: portos,
                                    hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


router.get('/formulario/avisoEntrada', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const despachos = await Despacho.find({usuarioID: req.user._id, despachoDataValidadeNumber: {$gte: dataHoje}}).lean()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()

            res.render('formulario/entradas/avisoEntrada', 
                {embarcacoes: embarcacoes,
                    tripulantes: tripulantes,
                        portos: portos,
                            despachos: despachos
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})



router.get('/entradas', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true:false;
    try{
        const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).limit(5).lean().sort({entradaData: 'desc'})
        res.render('formulario/entradas/entradas', 
            {avisoEntradas: avisoEntradas,
                admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})


router.get('/entradas/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await AvisoEntrada.count()
            if(parseInt(page) * limit >= contagem){
                nextPage = ''
                hidden = 'hidden'
            }else{
                nextPage = parseInt(page) + 1
                hidden = ''
            }

            if(parseInt(page) == 2){
                previousPage = ''
            }else{
                previousPage = parseInt(page) - 1
            }
            const avisoEntradas = await AvisoEntrada.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({entradaData: 'desc'})
                res.render('formulario/entradas/entradasPage', 
                    {avisoEntradas: avisoEntradas,
                        nextPage: nextPage,
                            previousPage: previousPage,
                                hidden: hidden,
                                    admin: admin
                    })
        }catch(err){
            req.flash('error_msg', 'Erro ao mostrar página')
            res.redirect('/formulario')
        }
})


router.get('/avisoEntrada/:id/pdf', Admin, async (req, res) => {
    try{
        const avisoEntradas = await AvisoEntrada.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean()
        const tripulantes = await Tripulante.find({_id: avisoEntradas.entradaTripulantes}).lean()
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
    }catch(err){
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/')
    }  
})


router.post('/formulario/avisoEntrada', eUser, async (req, res) => {
    const cleanString = req.body.entradaTripulantes.replace(/[\n' \[\]]/g, '');
    const tripulantes = cleanString.split(',');
    const avisoEntradaTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

        try{
            const novoAvisoEntrada = {
                usuarioID: req.user._id,
                entradaDespacho: req.body.entradaDespacho,
                entradaNprocesso: req.body.entradaNprocesso,
                entradaPortoChegada: req.body.entradaPortoChegada,
                entradaDataHoraChegada: req.body.entradaDataHoraChegada,
                entradaPosicaoPortoAtual: req.body.entradaPosicaoPortoAtual,
                entradaPortoOrigem: req.body.entradaPortoOrigem,
                entradaPortoDestino: req.body.entradaPortoDestino,
                entradaDataHoraEstimadaSaida: req.body.entradaDataHoraEstimadaSaida,
                entradaNomeRepresentanteEmbarcacao: req.body.entradaNomeRepresentanteEmbarcacao,
                entradaCPFCNPJRepresentanteEmbarcacao: req.body.entradaCPFCNPJRepresentanteEmbarcacao,
                entradaTelefoneRepresentanteEmbarcacao: req.body.entradaTelefoneRepresentanteEmbarcacao,
                entradaEnderecoRepresentanteEmbarcacao: req.body.entradaEnderecoRepresentanteEmbarcacao,
                entradaEmailRepresentanteEmbarcacao: req.body.entradaEmailRepresentanteEmbarcacao,
                entradaDadosUltimaInpecaoNaval: req.body.entradaDadosUltimaInpecaoNaval,
                entradaDeficienciasRetificadasPorto: req.body.entradaDeficienciasRetificadasPorto,
                entradaTransporteCagaPerigosa: req.body.entradaTransporteCagaPerigosa,
                entradaObservacoes: req.body.entradaObservacoes,
                entradaTripulantes: avisoEntradaTripulantes,
                entradaPassageiros: "Nome: "+ req.body.entradaPassageirosNome+
                " || Data de Nascimento: " + req.body.entradaPassageirosDataNascimento+
                " || Sexo: " + req.body.entradaPassageirosSexo,
                entradaComboios: "Nome: "+ req.body.entradaComboiosNome+
                " || Numero de Inscrição: "+ req.body.entradaComboiosNIncricao+
                " || Arqueação Bruta: "+ req.body.entradaComboiosArqueacaoBruta+
                " || Carga: "+ req.body.entradaComboiosCarga+
                " || Quantidade da Caga: "+ req.body.entradaComboiosQuantidadeCarga,
                entradaDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
                embarcacao: req.body.embarcacao,
                entradaData: Date.now(),
                entradaMesAnoAtual: moment(Date.now()).format('MM/YYYY')

            }
            new AvisoEntrada(novoAvisoEntrada).save()
                req.flash('success_msg', 'Aviso de entrada enviado com sucesso')
                res.redirect('/')
        }catch(err){
        req.flash('error_msg', 'Erro interno, tente novamente')
        res.redirect('/')
        }
})



module.exports = router