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
const moment = require('moment')
require('../models/Tripulante')
const Tripulante = mongoose.model('tripulantes')



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


router.get('/despacho/:id/pdf', async (req, res) => {
    try{
        const despachos = await Despacho.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({_id: despachos.embarcacao}).lean()
        const tripulantes = await Tripulante.find({_id: despachos.despachoTripulantes}).lean()
        const tripulanteNome = []
        const tripulanteGrau = []
        const tripulanteNCIR = []
        var tripulantesArray = tripulantes.forEach((el) => {
            tripulanteNome.push(el.tripulanteNome)
            tripulanteGrau.push(el.tripulanteGrau)
            tripulanteNCIR.push(el.tripulanteNCIR)
        })
        console.log(tripulantes)
        const html = `
        <form>
              <div>
                  <label>N° Processo de Despacho</label>
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
                    <textarea type="text">Nome: ${tripulanteNome} ||</textarea><br>
                    <textarea type="text">Grau: ${tripulanteGrau} ||</textarea><br>
                    <textarea type="text">Numero da CIR: ${tripulanteNCIR} ||</textarea><br>
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




router.get('/avisoEntrada/:id/pdf', (req, res) => {
    AvisoEntrada.findById(req.params.id).lean().then((avisoEntradas) => {
        Embarcacao.findOne({_id: avisoEntradas.embarcacao}).lean().then((embarcacoes) => {
      const html = `
      <form class="row gx-3 gy-2 align-items-center">
          <div>
              <label class="input-group-text" class="input-group-text">N° Pocesso de Despacho</label>
              <input name="entradaNprocesso" class="form-control" type="text" value="${avisoEntradas.entradaNprocesso}" disabled>
          </div>
          <div>
              <h4>Dados da Estadia</h4>
              <div>
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


module.exports = router