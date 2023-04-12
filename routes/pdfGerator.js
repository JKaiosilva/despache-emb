const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')
require('../models/AvisoEntrada')
const AvisoEntrada = mongoose.model('avisoEntradas')
require('../models/AvisoSaida')
const AvisoSaida = mongoose.model('avisoSaidas')
require('../models/Embarcacao')
const Embarcacao = mongoose.model('embarcacoes')
require('../models/Aviso')
const Aviso = mongoose.model('avisos')
const pdf = require('html-pdf')



router.get('/conteudo/:id/pdf', (req, res) => {
    Embarcacao.findById(req.params.id).then(embarcacoes => {
      const html = `
        

      <form class="row gx-3 gy-2 align-items-center">
      <input  type="hidden" name="usuarioID" value="%= req.user._id %">
      <div>
          <h4 class="text-center">Dados da Embarcação</h4>
              <div class="input-group mb-3">
                  <label class="input-group-text">Nome da Embarcação</label>
                  <input value="${embarcacoes.embarcacaoNome}" name="embarcacaoNome" class="form-control" type="text" disabled>
                  <label class="input-group-text">Tipo da Embarcação</label>
                  <input value="${embarcacoes.embarcacaoTipo}" name="embarcacaoTipo" class="form-control" type="text" disabled>
              </div>
      </div>
      <div class="input-group mb-3">
          <label class="input-group-text">Bandeira</label>
          <input value="${embarcacoes.embarcacaoBandeira}" name="embarcacaoBandeira" class="form-control" type="text" disabled>
          <label class="input-group-text">N° Inscrição na Autoridade Marítima do Brasil</label>
          <input value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" name="embarcacaoNInscricaoautoridadeMB" class="form-control" type="text" disabled>
      </div>
      <div class="input-group mb-3">
          <label class="input-group-text">Arqueação Bruta</label>
          <input value="${embarcacoes.embarcacaoArqueacaoBruta}" name="embarcacaoArqueacaoBruta" class="form-control" type="text" disabled>
          <label class="input-group-text">Comprimento Total</label>
          <input value="${embarcacoes.embarcacaoComprimentoTotal}" name="embarcacaoComprimentoTotal" class="form-control" type="text" disabled>
          <label class="input-group-text">Tonelagem Porte Bruto</label>
          <input value="${embarcacoes.embarcacaoTonelagemPorteBruto}" name="embarcacaoTonelagemPorteBruto" class="form-control" type="text" disabled>
      </div>
      <div class="input-group mb-3">
          <label class="input-group-text">Certificado de Registro do Amador(CRA)</label>
          <input value="${embarcacoes.embarcacaoCertificadoRegistroAmador}" name="embarcacaoCertificadoRegistroAmador" class="form-control" type="text" disabled>
          <label class="input-group-text">Armador</label>
          <input value="${embarcacoes.embarcacaoArmador}" name="embarcacaoArmador" class="form-control" type="text" disabled>
      </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">N° do CRA</label>
                  <input value="${embarcacoes.embarcacaoNCRA}" name="embarcacaoNCRA" class="form-control" type="text" disabled>
                  <label class="input-group-text">Validade</label>
                  <input value="${embarcacoes.embarcacaoValidade}" name="embarcacaoValidade" class="form-control" type="text" disabled>
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
  });







module.exports = router