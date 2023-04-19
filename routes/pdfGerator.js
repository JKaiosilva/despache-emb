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



router.get('/embarcacao/:id/pdf', (req, res) => {
    Embarcacao.findById(req.params.id).lean().then((embarcacoes) => {
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



router.get('/despacho/:id/pdf', (req, res) => {
       Despacho.findById(req.params.id).lean().then((despachos) => {
          Embarcacao.findOne({_id: despachos.embarcacao}).lean().then((embarcacoes) => {
      const html = `
      <form class="row gx-3 gy-2 align-items-center">
            <div class="input-group mb-3">
                <label class="input-group-text">N° Processo de Despacho</label>
                <input name="NprocessoDespacho" class="form-control" type="text" value="${despachos.NprocessoDespacho}" disabled>
            </div>
            <br>
            <div>
                <h4 class="text-center">Dados de Despacho (data off Clearence)</h4>
                    <div class="input-group mb-3">
                        <label class="input-group-text">Porto de Estadia</label>
                        <input name="despachoPortoEstadia" class="form-control" type="text" value="${despachos.despachoPortoEstadia}" disabled>
                        <label class="input-group-text">Data/Hora Estimada de Partida</label>
                        <input name="despachoDataHoraPartida" class="form-control" type="text" value="${despachos.despachoDataHoraPartida}" disabled>
                    </div>
            </div>
            <br>
            <div>
                <h4 class="text-center">Dados da Embarcação</h4>
                    <div class="input-group mb-3">
                        <label class="input-group-text">Nome da Embarcação</label>
                        <input name="despachoNomeEmbarcação" class="form-control" type="text" value="${despachos.despachoNomeEmbarcação}" disabled>
                        <label class="input-group-text">Tipo da Embarcação</label>
                        <input name="despachoTipoEmbarcacao" class="form-control" type="text" value="${despachos.despachoTipoEmbarcacao}" disabled>
                    </div>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Bandeira</label>
                <input name="despachoBandeira" class="form-control" type="text" value="${despachos.despachoBandeira}" disabled>
                <label class="input-group-text">N° Inscrição na Autoridade Marítima do Brasil</label>
                <input name="despachoNInscricaoautoridadeMB" class="form-control" type="text" value="${despachos.despachoNInscricaoautoridadeMB}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Arqueação Bruta</label>
                <input name="despachoArqueacaoBruta" class="form-control" type="text" value="${despachos.despachoArqueacaoBruta}" disabled>
                <label class="input-group-text">Comprimento Total</label>
                <input name="despachoComprimentoTotal" class="form-control" type="text" value="${despachos.despachoComprimentoTotal}" disabled>
                <label class="input-group-text">Tonelagem Porte Bruto</label>
                <input name="despachoTonelagemPorteBruto" class="form-control" type="text" value="${despachos.despachoTonelagemPorteBruto}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Certificado de Registro do Amador(CRA)</label>
                <input name="despachoCertificadoRegistroAmador" class="form-control" type="text" value="${despachos.despachoCertificadoRegistroAmador}" disabled>
                <label class="input-group-text">Armador</label>
                <input name="despachoArmador" class="form-control" type="text" value="{{despachos.despachoArmador}}" disabled>
            </div>
                    <div class="input-group mb-3">
                        <label class="input-group-text">N° do CRA</label>
                        <input name="despacgoNCRA" class="form-control" type="text" value="${despachos.despacgoNCRA}" disabled>
                        <label class="input-group-text">Validade</label>
                        <input name="despachoValidade" class="form-control" type="text" value="${despachos.despachoValidade}" disabled>
                    </div>
            
            <div>
                <h4 class="text-center">Dados de Representante da Embarcação</h4>
                    <div class="input-group mb-3">
                            <label class="input-group-text">Nome</label>
                            <input name="despachoNomeRepresentanteEmbarcacao" class="form-control" type="text" value="${despachos.despachoNomeRepresentanteEmbarcacao}" disabled>
                            <label class="input-group-text">CPF/CNPJ</label>
                            <input name="despachoCPFCNPJRepresentanteEmbarcacao" class="form-control" type="text" value="${despachos.despachoCPFCNPJRepresentanteEmbarcacao}" disabled>
                        </div>
                            <div class="input-group mb-3">
                                <label class="input-group-text">Telephone</label>
                                <input name="despachoTelefoneRepresentanteEmbarcacao" class="form-control" type="text" value="${despachos.despachoTelefoneRepresentanteEmbarcacao}" disabled>
                                <label class="input-group-text">Endereço</label>
                                <input name="despachoEnderecoRepresentanteEmbarcacao" class="form-control" type="text" value="${despachos.despachoEnderecoRepresentanteEmbarcacao}" disabled>
                                <label class="input-group-text">E-mail</label>
                                <input name="despachoEmailRepresentanteEmbarcacao" class="form-control" type="text" value="${despachos.despachoEmailRepresentanteEmbarcacao}" disabled>
                            </div>
                    
            </div>
            <div>
                <h4 class="text-center">Informações Complementares</h4>
                    <div class="input-group mb-3">
                        <label class="input-group-text">Data da Última Inspeção Naval</label>
                        <input name="despachoDataUltimaInspecaoNaval" class="form-control" type="text" value="${despachos.despachoDataUltimaInspecaoNaval}" disabled>
                    </div>
                <br>
                    <label class="input-group-text">Deficiências a serem retificadas neste porto?</label>
                    <input name="despachoDeficiencias" class="form-control" type="text" value="${despachos.despachoDeficiencias}" disabled>
                <br>
                    <label class="input-group-text">Transporta Carga Perigosa</label>
                    <input name="despachoTransportaCargaPerigosa" class="form-control" type="text" value="${despachos.despachoTransportaCargaPerigosa}" disabled>
                <br>
                    <label class="input-group-text">Há algum certificado ou documento temporário da embarcação, cuja validade expire nos proximos 90 dias?</label>
                    <input name="despachoCertificadoTemporario90dias" class="form-control" type="text" value="${despachos.despachoCertificadoTemporario90dias}" disabled>
                <br>
                    <div class="input-group mb-3">
                        <label class="input-group-text">Caso afirmativo, informe o(s) certificado(s)/documento(s) e suas respectivas datas de validade</label>
                        <input name="despachoCasoDocumentoExpirado" class="form-control" type="text" value="${despachos.despachoCasoDocumentoExpirado}" disabled>
                    </div>
            <div>
                <h4 class="text-center">Observações</h4>
                    <div class="input-group">
                        <input name="despachoOBS" class="form-control" value="${despachos.despachoOBS}" disabled>
                    </div>
            </div>
            <div>
                <h4 class="text-center mt-3">Lista de Tripulantes</h4>
                    <div class="input-group mb-3">
                        <label class="input-group-text">N° de Tripulantes - incluindo o Comandante</label>
                        <input name="despachoNTripulantes" class="form-control" type="text" value="${despachos.despachoNTripulantes}" disabled>
                        <label class="input-group-text">Nome do Comandante</label>
                        <input name="despachoNomeComandante" class="form-control" type="text" value="${despachos.despachoNomeComandante}" disabled>
                    </div>
            </div>
            <div>
                <div id="tripulantes" class="card bg-secondary">
                    <input name="despachoTripulantesNome" class="form-control" type="text" value="${despachos.despachoTripulantes}" disabled>
                </div>
            </div>
            <div>
                <h4 class="text-center">Comboios</h4>
                <span>No caso de navegação em comboio, preencher as informações abaixo sobre as embarcações não propulsadas componentes do comboio</span>
            </div>
            <div>
                <div class="input-group mb-3">
                    <label class="input-group-text">Nome da Embarcação</label>
                    <input name="despachoNomeEmbarcacao" class="form-control" type="text" value="${despachos.despachoNomeEmbarcacao}" disabled>
                    <label class="input-group-text">N° de Inscrição</label>
                    <input name="despachoNEmbN" class="form-control" type="text" value="${despachos.despachoNEmbN}" disabled>
                </div>
                <div class="input-group mb-3">
                    <label class="input-group-text">Arqueação Bruta</label>
                    <input name="despachoArqueacaoBrutaComboio" class="form-control" type="text" value="${despachos.despachoArqueacaoBrutaComboio}" disabled>
                    <label class="input-group-text">Carga</label>
                    <input name="despachoCarga" class="form-control" type="text" value="${despachos.despachoCarga}" disabled>
                    <label class="input-group-text">Quantidade e Unidade de Carga</label>
                    <input name="despachoQuantidadeCaga" class="form-control" type="text" value="${despachos.despachoQuantidadeCaga}" disabled>
                </div>
                        <div class="input-group mb-3">
                            <label class="input-group-text">Somatório da Arqueação Bruta das embarcações que compõem o comboio, incluindo a embarcação propulsora</label>
                            <input name="despachoSomaArqueacaoBruta" class="form-control" type="text" value="${despachos.despachoSomaArqueacaoBruta}" disabled>
                        </div>
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
        res.attachment(`${despachos.NprocessoDespacho}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
    })
  });
})




module.exports = router