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
const transporter = require('../config/sendMail')



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
        transporter.sendMail({
        from: 'Kaio Silva <crb.app.forms@hotmail.com>',
        to: 'kaiofer39@gmail.com',
        subject: `Embarcação: ${embarcacoes.embarcacaoNome}`,
        text: html
    });

  });

})


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
                        <input name="despachoNomeEmbarcação" class="form-control" type="text" value="${embarcacoes.embarcacaoNome}" disabled>
                        <label class="input-group-text">Tipo da Embarcação</label>
                        <input name="despachoTipoEmbarcacao" class="form-control" type="text" value="${embarcacoes.embarcacaoTipo}" disabled>
                    </div>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Bandeira</label>
                <input name="despachoBandeira" class="form-control" type="text" value="${embarcacoes.embarcacaoBandeira}" disabled>
                <label class="input-group-text">N° Inscrição na Autoridade Marítima do Brasil</label>
                <input name="despachoNInscricaoautoridadeMB" class="form-control" type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Arqueação Bruta</label>
                <input name="despachoArqueacaoBruta" class="form-control" type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" disabled>
                <label class="input-group-text">Comprimento Total</label>
                <input name="despachoComprimentoTotal" class="form-control" type="text" value="${embarcacoes.embarcacaoComprimentoTotal}" disabled>
                <label class="input-group-text">Tonelagem Porte Bruto</label>
                <input name="despachoTonelagemPorteBruto" class="form-control" type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Certificado de Registro do Amador(CRA)</label>
                <input name="despachoCertificadoRegistroAmador" class="form-control" type="text" value="${embarcacoes.embarcacaoCertificadoRegistroAmador}" disabled>
                <label class="input-group-text">Armador</label>
                <input name="despachoArmador" class="form-control" type="text" value="${embarcacoes.embarcacaoArmador}" disabled>
            </div>
                    <div class="input-group mb-3">
                        <label class="input-group-text">N° do CRA</label>
                        <input name="despacgoNCRA" class="form-control" type="text" value="${embarcacoes.embarcacaoNCRA}" disabled>
                        <label class="input-group-text">Validade</label>
                        <input name="despachoValidade" class="form-control" type="text" value="${embarcacoes.embarcacaoValidade}" disabled>
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




router.get('/avisoEntrada/:id/pdf', (req, res) => {
    AvisoEntrada.findById(req.params.id).lean().then((avisoEntradas) => {
        Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean().then((embarcacoes) => {
      const html = `
      <form class="row gx-3 gy-2 align-items-center">
          <div class="input-group mb-3">
              <label class="input-group-text" class="input-group-text">N° Pocesso de Despacho</label>
              <input name="entradaNprocesso" class="form-control" type="text" value="${avisoEntradas.entradaNprocesso}" disabled>
          </div>
          <div>
              <h4 class="text-center">Dados da Estadia</h4>
              <div class="input-group mb-3">
                  <label class="input-group-text">Porto de chegada</label>
                  <input name="entradaPortoChegada" class="form-control" type="text" value="${avisoEntradas.entradaPortoChegada}" disabled>
                  <label class="input-group-text">Data/Hora de chegada</label>
                  <input name="entradaDataHoraChegada" class="form-control" type="text" value="${avisoEntradas.entradaDataHoraChegada}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Posição no Porto Atual</label>
                  <input name="entradaPosicaoPortoAtual" class="form-control" type="text" value="${avisoEntradas.entradaPosicaoPortoAtual}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Porto de Origem</label>
                  <input name="entradaPortoOrigem" class="form-control" type="text" value="${avisoEntradas.entradaPortoOrigem}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Porto de Destino</label>
                  <input name="entradaPortoDestino" class="form-control" type="text" value="${avisoEntradas.entradaPortoDestino}" disabled>
                  <label class="input-group-text">Data/Hora Estimada de Saída para Porto de destino</label>
                  <input name="entradaDataHoraEstimadaSaida" class="form-control" type="text" value="${avisoEntradas.entradaDataHoraEstimadaSaida}" disabled>
              </div>
          <div>
              <h4 class="text-center">Dados da Embarcação</h4>
                  <div class="input-group mb-3">
                      <label class="input-group-text">Nome da Embarcação</label>
                      <input name="entradaNomeEmbarcacao" class="form-control" type="text" value="${embarcacoes.embarcacaoNome}" disabled>
                      <label class="input-group-text">Tipo da Embarcação</label>
                      <input name="entradaTipoEmbarcacao" class="form-control" type="text" value="${embarcacoes.embarcacaoTipo}" disabled>
                  </div>
                  <div class="input-group mb-3">
                      <label class="input-group-text">Bandeira</label>
                      <input name="entradaBandeira" class="form-control" type="text" value="${embarcacoes.embarcacaoBandeira}" disabled>
                      <label class="input-group-text">N° Inscrição na Autoridade Marítima do Brasil</label>
                      <input name="entradaNInscricaoAutoridadeMaritima" class="form-control" type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" disabled>
                  </div>
                  <div class="input-group mb-3">
                      <label class="input-group-text">Arqueação Buta</label>
                      <input name="entradaArqueacaoBruta" class="form-control" type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" disabled>
                      <label class="input-group-text">Tonelagem Porte Bruto</label>
                      <input name="entradaTonelagemPorteBruto" class="form-control" type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" disabled>
                  </div>
          </div>
              <h4 class="text-center">Dados do Representante da Embarcação</h4>
              <div class="input-group mb-3">
                  <label class="input-group-text">Nome</label>
                  <input name="entradaNomeRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoEntradas.entradaNomeRepresentanteEmbarcacao}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">CPF/CNPJ</label>
                  <input name="entradaCPFCNPJRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoEntradas.entradaCPFCNPJRepresentanteEmbarcacao}" disabled>
                  <label class="input-group-text">Telefone</label>
                  <input name="entradaTelefoneRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoEntradas.entradaTelefoneRepresentanteEmbarcacao}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Endereço</label>
                  <input name="entradaEnderecoRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoEntradas.entradaEnderecoRepresentanteEmbarcacao}" disabled>
                  <label class="input-group-text">Email</label>
                  <input name="entradaEmailRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoEntradas.entradaEmailRepresentanteEmbarcacao}" disabled>
              </div>
          </div>
          <div>
              <h4 class="text-center">Informações Complementares</h4>
              <div class="input-group mb-3">
                  <label class="input-group-text">Dados da Ultima Inspeção Naval</label>
                  <input name="entradaDadosUltimaInpecaoNaval" class="form-control" type="text" value="${avisoEntradas.entradaDadosUltimaInpecaoNaval}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Deficiências a serem retificadas neste porto?</label>
                  <input name="entradaDeficienciasRetificadasPorto" class="form-control" type="text" value="${avisoEntradas.entradaDeficienciasRetificadasPorto}" disabled>
              </div>
              <div class="input-group mb-3">
                  <label class="input-group-text">Transporte de Carga Perigosa</label>
                  <input name="entradaTransporteCagaPerigosa" class="form-control" type="text" value="${avisoEntradas.entradaTransporteCagaPerigosa}" disabled>
              </div>
          </div>
          <div>
              <h4 class="text-center">Observações</h4>
              <div class="input-group mb-3">
                  <input name="entradaObservacoes" class="form-control" type="text" value="${avisoEntradas.entradaObservacoes}" disabled>
              </div>
          </div>
          <div>
              <div id="tripulantes" class="card bg-secondary">
                  <h4 class="text-center">Lista de Tripulantes</h4>
                  <input name="entradaTripulantes" class="form-control" type="text" value="${avisoEntradas.entradaTripulantes}" disabled>
              </div>
          </div>
          <div>
              <div id="passageiros" class="card bg-secondary">
                  <h4 class="text-center">Lista de Passageiros</h4>
                  <input name="entradaPassageiros" class="form-control" type="text" value="${avisoEntradas.entradaPassageiros}" disabled>
                  </div>
              </div>
              <div>
              <div id="comboios" class="card bg-secondary">
                  <h4 class="text-center">Lista de Comboios</h4>
                  <input name="entradaComboios" class="form-control" type="text" value="${avisoEntradas.entradaComboios}" disabled>
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
          res.attachment(`${avisoEntradas.entradaNprocesso}.pdf`);
          res.setHeader('Content-Type', 'application/pdf');
          stream.pipe(res);
        
        });
    })
  });
})



router.get('/avisoSaida/:id/pdf', (req, res) => {
  AvisoSaida.findById(req.params.id).lean().then((avisoSaidas) => {
      Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean().then((embarcacoes) => {
    const html = `
    <form class="row gx-3 gy-2 align-items-center">
        <div class="input-group mb-3">
            <label class="input-group-text" class="input-group-text">N° Pocesso de Despacho</label>
            <input name="saidaNprocesso" class="form-control" type="text" value="${avisoSaidas.saidaNprocesso}" disabled>
        </div>
        <div>
            <h4 class="text-center">Dados da Partida</h4>
            <div class="input-group mb-3">
                <label class="input-group-text">Porto de Saída</label>
                <input name="saidaPortoSaida" class="form-control" type="text" value="${avisoSaidas.saidaPortoSaida}" disabled>
                <label class="input-group-text">Data/Hora de Saída</label>
                <input name="saidaDataHoraSaida" class="form-control" type="text" value="${avisoSaidas.saidaDataHoraSaida}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Porto de Destino</label>
                <input name="saidaPortoDestino" class="form-control" type="text" value="${avisoSaidas.saidaPortoDestino}" disabled>
                <label class="input-group-text">Data/Hora Estimada de Chegada</label>
                <input name="saidaDataHoraChegada" class="form-control" type="text" value="${avisoSaidas.saidaDataHoraChegada}" disabled>
            </div>
            <div class="input-group mb-3">
            <h4 class="text-center">Dados da Embarcação</h4>
                <div class="input-group mb-3">
                    <label class="input-group-text">Nome da Embarcação</label>
                    <input name="saidaNomeEmbarcacao" class="form-control" type="text" value="${embarcacoes.embarcacaoNome}" disabled>
                    <label class="input-group-text">Tipo da Embarcação</label>
                    <input name="saidaTipoEmbarcacao" class="form-control" type="text" value="${embarcacoes.embarcacaoTipo}" disabled>
                </div>
                <div class="input-group mb-3">
                    <label class="input-group-text">Bandeira</label>
                    <input name="saidaBandeira" class="form-control" type="text" value="${embarcacoes.embarcacaoBandeira}" disabled>
                    <label class="input-group-text">N° Inscrição na Autoridade Marítima do Brasil</label>
                    <input name="saidaNInscricaoAutoridadeMaritima" class="form-control" type="text" value="${embarcacoes.embarcacaoNInscricaoautoridadeMB}" disabled>
                </div>
                <div class="input-group mb-3">
                    <label class="input-group-text">Arqueação Buta</label>
                    <input name="saidaArqueacaoBruta" class="form-control" type="text" value="${embarcacoes.embarcacaoArqueacaoBruta}" disabled>
                    <label class="input-group-text">Tonelagem Porte Bruto</label>
                    <input name="saidaTonelagemPorteBruto" class="form-control" type="text" value="${embarcacoes.embarcacaoTonelagemPorteBruto}" disabled>
                </div>
        </div>
            <h4 class="text-center">Dados do Representante da Embarcação</h4>
            <div class="input-group mb-3">
                <label class="input-group-text">Nome</label>
                <input name="saidaNomeRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoSaidas.saidaNomeRepresentanteEmbarcacao}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">CPF/CNPJ</label>
                <input name="saidaCPFCNPJRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoSaidas.saidaCPFCNPJRepresentanteEmbarcacao}" disabled>
                <label class="input-group-text">Telefone</label>
                <input name="saidaTelefoneRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoSaidas.saidaTelefoneRepresentanteEmbarcacao}" disabled>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Endereço</label>
                <input name="saidaEnderecoRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoSaidas.saidaEnderecoRepresentanteEmbarcacao}" disabled>
                <label class="input-group-text">Email</label>
                <input name="saidaEmailRepresentanteEmbarcacao" class="form-control" type="text" value="${avisoSaidas.saidaEmailRepresentanteEmbarcacao}" disabled>
            </div>
        </div>
        <div>
            <h4 class="text-center">Observações</h4>
            <div class="input-group mb-3">
                <input name="saidaObservacoes" class="form-control" type="text" value="${avisoSaidas.saidaObservacoes}" disabled>
            </div>
        </div>
        <div>
            <div id="tripulantes" class="card bg-secondary">
                <h4 class="text-center">Lista de Tripulantes</h4>
                <input name="saidaTripulantes" class="form-control" type="text" value="${avisoSaidas.saidaTripulantes}" disabled>
            </div>
        </div>
        <div>
            <div id="passageiros" class="card bg-secondary">
                <h4 class="text-center">Lista de Passageiros</h4>
                <input name="saidaPassageiros" class="form-control" type="text" value="${avisoSaidas.saidaPassageiros}" disabled>
                </div>
            </div>
            <div class="input-group mb-3">
                <label class="input-group-text">Somatório de Passageiros</label>
                <input value="${avisoSaidas.saidaSomaPassageiros}" class="form-control" type="number" disabled>
            </div>
            <div>
            <div id="comboios" class="card bg-secondary">
                <h4 class="text-center">Lista de Comboios</h4>
                <input name="saidaComboios" class="form-control" type="text" value="${avisoSaidas.saidaComboios}" disabled>
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
    })
  });
})

router.get('/admin/relatorioSaidas', async (req, res) => {
    try{
        const avisoSaidas = await AvisoSaida.find().lean()
        const embarcacoes = await Embarcacao.find().lean()
        somaPassageiros = 0
        ultimoMes = Date.now() - 2629800000

        let bandeirasTotal = ['Paraguaio', 'Argentino', 'Uruguaio', 'Boliviano', 'Brasileiro']
        let bandeirasExt = ['Paraguaio', 'Argentino', 'Uruguaio', 'Boliviano']
        let bandeirasBRA = ['Brasileiro']
        let bandeirasBO = ['Boliviano']
        let bandeirasPA = ['Paraguai']
        let bandeirasARG = ['Argentino']
        let bandeirasURU = ['Uruguaio']

        let somaEmbarcacaoTotal = embarcacoes.filter((el) => bandeirasTotal.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoExt = embarcacoes.filter((el) => bandeirasExt.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoBRA = embarcacoes.filter((el) => bandeirasBRA.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoBO = embarcacoes.filter((el) => bandeirasBO.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoPA = embarcacoes.filter((el) => bandeirasPA.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoARG = embarcacoes.filter((el) => bandeirasARG.includes(el.embarcacaoBandeira)).length
        let somaEmbarcacaoURU = embarcacoes.filter((el) => bandeirasURU.includes(el.embarcacaoBandeira)).length
        
            avisoSaidas.forEach(passageiros => {
            if(passageiros.saidaData > ultimoMes){
                passag = parseInt(passageiros.saidaSomaPassageiros)
                somaPassageiros += passag
            }
            })
    
            const html = `<h1>Relatório do Ultimo mês</h1><br>
                        <label>Número de Passageiros: ${somaPassageiros}</label><br>
                        <label>Embarcações Totais: ${somaEmbarcacaoTotal}</label><br>
                        <label>Embarcações Internacionais: ${somaEmbarcacaoExt}</label><br>
                        <label>Embarcações Brasileiras: ${somaEmbarcacaoBRA}</label><br>
                        <label>Embarcações Bolivianas: ${somaEmbarcacaoBO}</label><br>
                        <label>Embarcações Paraguaias: ${somaEmbarcacaoPA}</label><br>
                        <label>Embarcações Argentinas: ${somaEmbarcacaoARG}</label><br>
                        <label>Embarcações Uruguaias: ${somaEmbarcacaoURU}</label><br>

                        `
        
            
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.send(err);
            res.attachment(`Relatorio.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        })
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro interno ao gerar relatório')
        res.redirect('/admin/painel')
    }
})



module.exports = router