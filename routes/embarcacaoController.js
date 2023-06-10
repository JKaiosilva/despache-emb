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


router.get('/admin/embarcacoes', Admin, (req, res) => {
    Embarcacao.find().limit(5).lean().sort({ EmbarcacaoNome: 'asc' }).then((embarcacoes) => {
        res.render('admin/embarcacoes/listaEmbarcacoes', { embarcacoes: embarcacoes })
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao mostrar embarcações')
        res.redirect('/')
    })
})


router.get('/admin/embarcacoes/:page', Admin, async (req, res) => {
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
        const embarcacoes = await Embarcacao.find().skip(skip).limit(limit).lean().sort({ embarcacaoNome: 'asc' })
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


router.get('/admin/embarcacoesEdit/:id', Admin, async(req, res) => {
    try{
        const embarcacao = await Embarcacao.findOne({_id: req.params.id}).lean()
        res.render('admin/embarcacoes/embarcacaoEdit', {
            embarcacao: embarcacao
        })
    }catch(err){

    }
})


router.post('/admin/embarcacoesEdit', Admin, async(req, res) => {
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
            embarcacaoValidade: req.body.embarcacaoValidadeNumber,
            embarcacaoValidadeNumber: Date.parse(req.body.embarcacaoValidadeNumber)
        })
        req.flash('success_msg', 'Embarcação editada com sucesso!')
        res.redirect('painel')
    }catch(err){
        req.flash('error_msg', 'Erro ao editar embarcação.')
        res.redirect('painel')
    }
})



router.get('/formulario/embarcacaoVizu/:id', eUser, async(req, res) => {
    try{
        if(req.user.eAdmin){
            hidden = ''
        }else{
            hidden = 'hidden'
        }
        const embarcacoes = await Embarcacao.findOne({_id: req.params.id}).lean()
        const despachos = await Despacho.find({embarcacao: embarcacoes._id}).lean()
        const avisoEntradas = await AvisoEntrada.find({embarcacao: embarcacoes._id}).lean()
        const avisoSaidas = await AvisoSaida.find({embarcacao: embarcacoes._id}).lean()
            res.render('formulario/embarcacoes/embarcacaoVizu',
                {embarcacoes: embarcacoes,
                    despachos: despachos,
                        avisoEntradas: avisoEntradas,
                            avisoSaidas: avisoSaidas,
                                hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar Embarcação')
        res.redirect('/')
    }
})




router.get('/formulario/addEmbarcacao', eUser, async (req, res) => {
    try{
        res.render('formulario/embarcacoes/addEmbarcacao')
    }catch(err){
        req.flash('error_msg', 'Erro interno')
        res.redirect('/')
    }
})



router.get('/embarcacoes', eUser, async (req, res) => {
    try{
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).limit(5).lean().sort({embarcacaoNome: 'asc'})
            res.render('formulario/embarcacoes/embarcacoes', 
                {embarcacoes: embarcacoes
            })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
    }
})



router.get('/embarcacoes/:page', eUser, async (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
     try{
        const contagem = await Embarcacao.count({usuarioID: req.user._id})
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
        const embarcacoes = await Embarcacao.find({usuarioID: req.user._id}).skip(skip).limit(limit).lean().sort({embarcacaoNome: 'asc'})
            res.render('formulario/embarcacoes/embarcacoesPage', 
                {embarcacoes: embarcacoes,
                    nextPage: nextPage,
                        previousPage: previousPage,
                            hidden: hidden
                })
    }catch(err){
        req.flash('error_msg', 'Erro ao mostrar página')
        res.redirect('/formulario')
     }
})


router.get('/embarcacao/:id/pdf', Admin, (req, res) => {
    Embarcacao.findById(req.params.id).lean().then((embarcacoes) => {
      const html = `
      <form>
      <input  type="hidden" name="usuarioID" value="%= req.user._id %">
      <div>
          <h4 class="text-center">Dados da Embarcação</h4>
              <div>
                  <label>Nome da Embarcação</label>
                  <input value="${embarcacoes.embarcacaoNome}" name="embarcacaoNome" type="text" disabled>
                  <label>Tipo da Embarcação</label>
                  <input value="${embarcacoes.embarcacaoTipo}" name="embarcacaoTipo" type="text" disabled>
              </div>
      </div>
      <div>
          <label>Bandeira</label>
          <input value="${embarcacoes.embarcacaoBandeira}" name="embarcacaoBandeira" type="text" disabled>
          <label>N° Inscrição na Autoridade Marítima do Brasil</label>
          <input value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" name="embarcacaoNInscricaoautoridadeMB" type="text" disabled>
      </div>
      <div>
          <label>Arqueação Bruta</label>
          <input value="${embarcacoes.embarcacaoArqueacaoBruta}" name="embarcacaoArqueacaoBruta" type="text" disabled>
          <label>Comprimento Total</label>
          <input value="${embarcacoes.embarcacaoComprimentoTotal}" name="embarcacaoComprimentoTotal" type="text" disabled>
          <label>Tonelagem Porte Bruto</label>
          <input value="${embarcacoes.embarcacaoTonelagemPorteBruto}" name="embarcacaoTonelagemPorteBruto" type="text" disabled>
      </div>
      <div>
          <label>Certificado de Registro do Amador(CRA)</label>
          <input value="${embarcacoes.embarcacaoCertificadoRegistroAmador}" name="embarcacaoCertificadoRegistroAmador" type="text" disabled>
          <label>Armador</label>
          <input value="${embarcacoes.embarcacaoArmador}" name="embarcacaoArmador" type="text" disabled>
      </div>
              <div>
                  <label>N° do CRA</label>
                  <input value="${embarcacoes.embarcacaoNCRA}" name="embarcacaoNCRA" type="text" disabled>
                  <label>Validade</label>
                  <input value="${embarcacoes.embarcacaoValidade}" name="embarcacaoValidade" type="text" disabled>
              </div>
      </div>
  </form>
</div>
</div>

      `;

        pdf.create(html).toStream((err, stream) => {
        if (err) return res.send(err);
        res.attachment(`${embarcacoes.embarcacaoNome}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
  });

})



router.post('/formulario/addEmbarcacao', eUser, (req, res) => {
    const novaEmbarcacao = {
        usuarioID: req.user._id,
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
        embarcacaoDataCadastro: moment(Date.now()).format('DD/MM/YYYY HH:mm'),
        embarcacaoData: Date.now(),
        embarcacaoMesAnoAtual: moment(Date.now()).format('MM/YYYY')
    }
    new Embarcacao(novaEmbarcacao).save().then(() => {
        req.flash('success_msg', 'Embarcação cadastrada com sucesso')
        res.redirect('/')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao salvar embarcação')
        res.redirect('/')
    })
})


module.exports = router