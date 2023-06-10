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


router.get('/admin/despachos', Admin, (req, res) => {
    Despacho.find().limit(5).lean().sort({ despachoData: 'desc' }).then((despachos) => {
        res.render('admin/despachos/listaDespacho', { despachos: despachos })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar despachos!')
        res.redirect('/')
    })
})


router.get('/admin/despachos/:page', Admin, async (req, res) => {
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


router.get('/admin/despachosValidate/:id', Admin, async(req, res) => {
    try{
        const despachos = await Despacho.findOne({_id: req.params.id}).lean();
        const embDespacho = await Embarcacao.findOne({_id: despachos.embarcacao}).lean();
        const embarcacoes = await Embarcacao.find().lean();
        const portos = await Porto.find().lean();
        const portoDespacho = await Porto.findOne({_id: despachos.despachoPortoEstadia}).lean();
        const tripDespacho = await Tripulante.find({_id: despachos.despachoTripulantes}).lean();
        const tripulantes = await Tripulante.find().lean();
            res.render('admin/despachos/despachoValidate', {
                despachos: despachos,
                    embarcacoes: embarcacoes,
                        portos: portos,
                            portoDespacho: portoDespacho,
                                embDespacho: embDespacho,
                                    tripDespacho: tripDespacho,
                                        tripulantes: tripulantes

            })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro interno ao mostrar despachos!')
        res.redirect('/')
    }
})


router.post('/admin/despachoValidate', Admin, async(req, res) => {
    try{
     const cleanString = req.body.despachoTripulantes.replace(/[\n' \[\]]/g, '');
     const tripulantes = cleanString.split(',');
     const despachoTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));
  
         await Despacho.updateOne({_id: req.body.id}, {
             NprocessoDespacho: req.body.NprocessoDespacho,
             despachoPortoEstadia: req.body.despachoPortoEstadia,
             despachoDataHoraPartida: req.body.despachoDataHoraPartida,
             despachoNomeRepresentanteEmbarcacao: req.body.despachoNomeRepresentanteEmbarcacao,
             despachoCPFCNPJRepresentanteEmbarcacao: req.body.despachoCPFCNPJRepresentanteEmbarcacao,
             despachoTelefoneRepresentanteEmbarcacao: req.body.despachoTelefoneRepresentanteEmbarcacao,
             despachoEnderecoRepresentanteEmbarcacao: req.body.despachoEnderecoRepresentanteEmbarcacao,
             despachoEmailRepresentanteEmbarcacao: req.body.despachoEmailRepresentanteEmbarcacao,
             despachoDataUltimaInspecaoNaval: req.body.despachoDataUltimaInspecaoNaval,
             despachoDeficiencias: req.body.despachoDeficiencias,
             despachoTransportaCargaPerigosa: req.body.despachoTransportaCargaPerigosa,
             despachoCertificadoTemporario90dias: req.body.despachoCertificadoTemporario90dias,
             despachoCasoDocumentoExpirado: req.body.despachoCasoDocumentoExpirado,
             despachoOBS: req.body.despachoOBS,
             despachoNTripulantes: req.body.despachoNTripulantes,
             despachoNomeComandante: req.body.despachoNomeComandante,
             despachoTripulantes: despachoTripulantes,
             despachoNomeEmbarcacao: req.body.despachoNomeEmbarcacao,
             despachoNEmbN: req.body.despachoNEmbN,
             despachoArqueacaoBrutaComboio: req.body.despachoArqueacaoBrutaComboio,
             despachoCarga: req.body.despachoCarga,
             despachoQuantidadeCaga: req.body.despachoQuantidadeCaga,
             despachoSomaArqueacaoBruta: req.body.despachoSomaArqueacaoBruta,
             despachoDataSolicitada: req.body.despachoDataSolicitada,
             despachoDataValidade: req.body.despachoDataValidade,
             despachoDataValidadeNumber: Date.parse(req.body.despachoDataValidade),
             despachoValidade: Date.parse(req.body.despachoDataValidade)
         })
         req.flash('success_msg', 'Despacho Validade com sucesso!')
         res.redirect('painel')
     }catch(err){
         console.log(err)
         req.flash('error_msg', 'Erro ao validar despachos!')
         res.redirect('painel')
     }
 })


 router.get('/formulario/despachoVizu/:id', eUser, async (req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const despachos = await Despacho.findOne({_id: req.params.id}).lean()
        const tripulantes = await Tripulante.find({_id: despachos.despachoTripulantes}).lean()
        const embarcacoes = await Embarcacao.findOne({_id: despachos.embarcacao}).lean()
        const portos = await Porto.findOne({_id: despachos.despachoPortoEstadia}).lean()
        const avisoEntradas = await AvisoEntrada.find({entradaDespacho: despachos._id}).lean()
        const avisoSaidas = await AvisoSaida.find({saidaDespacho: despachos._id}).lean()
            res.render('formulario/despachos/despachoVizu',
                {despachos: despachos,
                tripulantes: tripulantes,
                embarcacoes: embarcacoes,
                portos: portos,
                avisoEntradas: avisoEntradas,
                avisoSaidas: avisoSaidas,
                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulário')
        res.redirect('/formulario')
    }
})


router.get('/formulario/despacho', eUser, async(req, res) => {
    try{
        const dataHoje = Date.now()
        const tripulantes = await Tripulante.find({tripulanteValidadeCIRNumber: {$gte: dataHoje}}).lean()
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id, embarcacaoValidadeNumber: {$gte: dataHoje}}).lean()
        const portos = await Porto.find().lean()
        res.render('formulario/despachos/despacho', 
            {embarcacoes: embarcacoes,
                tripulantes: tripulantes,
                    portos: portos 
            })
    }catch(err){
        req.flash('error_msg', 'Erro interno ao mostrar formulario')
        res.redirect('formulario/preform')
    }
})


router.get('/despachos', eUser, async (req, res) => {

    const admin = req.user.eAdmin ? true : false;
    try{
        const despachos = await Despacho.find({usuarioID: req.user._id}).limit(5).lean().sort({despachoData: 'desc'})
            res.render('formulario/despachos/despachos', 
                {despachos: despachos,
                    admin: admin
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})



router.get('/despachos/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const admin = req.user.eAdmin ? true : false;

        try{
            const contagem = await Despacho.count({usuarioID: req.user._id})
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
            const despachos = await Despacho.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({despachoData: 'desc'})
                res.render('formulario/despachos/despachosPage', 
                    {despachos: despachos,
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



router.get('/despacho/:id/pdf', Admin, async (req, res) => {
    try{
        const despachos = await Despacho.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({_id: despachos.embarcacao}).lean()
        const tripulantes = await Tripulante.find({_id: despachos.despachoTripulantes}).lean()
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
                  <h1>N° Processo de Despacho</h1>
                  <inputtype="text" value="${despachos.NprocessoDespacho}">
              </div>
              <br>
              <div>
                  <h4>Dados de Despacho (data off Clearence)</h4>
                      <div>
                          <label>Porto de Estadia</label>
                          <input type="text" value="${despachos.despachoPortoEstadia}">
                          <label>Data/Hora Estimada de Partida</label>
                          <input type="text" value="${despachos.despachoDataHoraPartida}">
                      </div>
              </div>
              <br>
              <div>
                  <h4>Dados da Embarcação</h4>
                      <div>
                          <label>Nome da Embarcação</label>
                          <input type="text" value="${embarcacoes.embarcacaoNome}">
                          <label>Tipo da Embarcação</label>
                          <input type="text" value="${embarcacoes.embarcacaoTipo}">
                      </div>
              </div>
              <div>
                  <label>Bandeira</label>
                  <input type="text" value="${embarcacoes.embarcacaoBandeira}">
                  <label>N° Inscrição na Autoridade Marítima do Brasil</label>
                  <input type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}">
              </div>
              <div>
                  <label>Arqueação Bruta</label>
                  <input type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}">
                  <label>Comprimento Total</label>
                  <input type="text" value="${embarcacoes.embarcacaoComprimentoTotal}">
                  <label>Tonelagem Porte Bruto</label>
                  <input type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}">
              </div>
              <div>
                  <label>Certificado de Registro do Amador(CRA)</label>
                  <input type="text" value="${embarcacoes.embarcacaoCertificadoRegistroAmador}">
                  <label>Armador</label>
                  <input type="text" value="${embarcacoes.embarcacaoArmador}">
              </div>
                      <div>
                          <label>N° do CRA</label>
                          <input type="text" value="${embarcacoes.embarcacaoNCRA}">
                          <label>Validade</label>
                          <input type="text" value="${embarcacoes.embarcacaoValidade}">
                      </div>
              
              <div>
                  <h4>Dados de Representante da Embarcação</h4>
                      <div>
                              <label>Nome</label>
                              <input type="text" value="${despachos.despachoNomeRepresentanteEmbarcacao}">
                              <label>CPF/CNPJ</label>
                              <input type="text" value="${despachos.despachoCPFCNPJRepresentanteEmbarcacao}">
                          </div>
                              <div>
                                  <label>Telephone</label>
                                  <input type="text" value="${despachos.despachoTelefoneRepresentanteEmbarcacao}">
                                  <label>Endereço</label>
                                  <input type="text" value="${despachos.despachoEnderecoRepresentanteEmbarcacao}">
                                  <label>E-mail</label>
                                  <input type="text" value="${despachos.despachoEmailRepresentanteEmbarcacao}">
                              </div>
                      
              </div>
              <div>
                  <h4>Informações Complementares</h4>
                      <div>
                          <label>Data da Última Inspeção Naval</label>
                          <input type="text" value="${despachos.despachoDataUltimaInspecaoNaval}">
                      </div>
                  <br>
                      <label>Deficiências a serem retificadas neste porto?</label>
                      <input type="text" value="${despachos.despachoDeficiencias}">
                  <br>
                      <label>Transporta Carga Perigosa</label>
                      <input type="text" value="${despachos.despachoTransportaCargaPerigosa}">
                  <br>
                      <label>Há algum certificado ou documento temporário da embarcação, cuja validade expire nos proximos 90 dias?</label>
                      <input type="text" value="${despachos.despachoCertificadoTemporario90dias}">
                  <br>
                      <div>
                          <label>Caso afirmativo, informe o(s) certificado(s)/documento(s) e suas respectivas datas de validade</label>
                          <input type="text" value="${despachos.despachoCasoDocumentoExpirado}">
                      </div>
              <div>
                  <h4>Observações</h4>
                      <div>
                          <input value="${despachos.despachoOBS}">
                      </div>
              </div>
              <div>
                  <h4>Lista de Tripulantes</h4>
                      <div>
                          <label>N° de Tripulantes - incluindo o Comandante</label>
                          <input type="text" value="${despachos.despachoNTripulantes}">
                          <label>Nome do Comandante</label>
                          <input type="text" value="${despachos.despachoNomeComandante}">
                      </div>
              </div>
              <div>
                <div id="tripulantes">
                    <label>Tripulantes:</label>
                    ${tripulantesInfos}<br>
                </div>
            </div>
            <br>
              <div>
                  <h4>Comboios</h4>
                  <span>No caso de navegação em comboio, preencher as informações abaixo sobre as embarcações não propulsadas componentes do comboio</span>
              </div>
              <div>
                  <div>
                      <label>Nome da Embarcação</label>
                      <input type="text" value="${despachos.despachoNomeEmbarcacao}">
                      <label>N° de Inscrição</label>
                      <input type="text" value="${despachos.despachoNEmbN}">
                  </div>
                  <div>
                      <label>Arqueação Bruta</label>
                      <input type="text" value="${despachos.despachoArqueacaoBrutaComboio}">
                      <label>Carga</label>
                      <input type="text" value="${despachos.despachoCarga}">
                      <label>Quantidade e Unidade de Carga</label>
                      <input type="text" value="${despachos.despachoQuantidadeCaga}">
                  </div>
                          <div>
                              <label>Somatório da Arqueação Bruta das embarcações que compõem o comboio, incluindo a embarcação propulsora</label>
                              <input type="text" value="${despachos.despachoSomaArqueacaoBruta}">
                          </div>
                  </div>
                  </div>
                  <div>
                      <label>Embarcação</label>
                      <input value="${embarcacoes.embarcacaoNome}">
                  </div>
          </form>
        `
        pdf.create(html).toStream((err, stream) => {
          if (err) return res.send(err);
          res.attachment(`${despachos.NprocessoDespacho}.pdf`);
          res.setHeader('Content-Type', 'application/pdf');
          stream.pipe(res);
        });
    }catch(err){
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/')
    }  
})



router.post('/formulario/despacho', eUser, async (req, res) => {


    try{
        const cleanString = req.body.despachoTripulantes.replace(/[\n' \[\]]/g, '');
        const tripulantes = cleanString.split(',');
        const despachoTripulantes = tripulantes.map((id) => mongoose.Types.ObjectId(id));

    const novoDespacho = {
        usuarioID: req.user._id,
        NprocessoDespacho: req.body.NprocessoDespacho,
        despachoPortoEstadia: req.body.despachoPortoEstadia,
        despachoDataHoraPartida: req.body.despachoDataHoraPartida,
        despachoNomeRepresentanteEmbarcacao: req.body.despachoNomeRepresentanteEmbarcacao,
        despachoCPFCNPJRepresentanteEmbarcacao: req.body.despachoCPFCNPJRepresentanteEmbarcacao,
        despachoTelefoneRepresentanteEmbarcacao: req.body.despachoTelefoneRepresentanteEmbarcacao,
        despachoEnderecoRepresentanteEmbarcacao: req.body.despachoEnderecoRepresentanteEmbarcacao,
        despachoEmailRepresentanteEmbarcacao: req.body.despachoEmailRepresentanteEmbarcacao,
        despachoDataUltimaInspecaoNaval: req.body.despachoDataUltimaInspecaoNaval,
        despachoDeficiencias: req.body.despachoDeficiencias,
        despachoTransportaCargaPerigosa: req.body.despachoTransportaCargaPerigosa,
        despachoCertificadoTemporario90dias: req.body.despachoCertificadoTemporario90dias,
        despachoCasoDocumentoExpirado: req.body.despachoCasoDocumentoExpirado,
        despachoOBS: req.body.despachoOBS,
        despachoNTripulantes: req.body.despachoNTripulantes,
        despachoNomeComandante: req.body.despachoNomeComandante,
        despachoTripulantes: despachoTripulantes,
        despachoComboios: req.body.despachoComboios,
        despachoCarga: req.body.despachoComboiosCarga,
        despachoQuantidadeCaga: req.body.despachoComboiosQuantidadeCarga,
        despachoSomaArqueacaoBruta: req.body.despachoSomaArqueacaoBruta,
        despachoDataSolicitada: req.body.despachoDataSolicitada,
        despachoDataPedido: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
        despachoData: Date.now(),
        embarcacao: req.body.embarcacao,
        depachoMesAnoAtual: moment(Date.now()).format('MM/YYYY')

    }
    new Despacho(novoDespacho).save()
        req.flash('success_msg', 'Despacho enviado com sucesso')
        res.redirect('/')

}catch(err){
    req.flash('error_msg', 'Erro interno, tente novamente')
    res.redirect('/')
}
})




module.exports = router