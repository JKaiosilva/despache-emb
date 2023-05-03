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
        const tripulantesInfos = []
        var tripulantesArray = tripulantes.forEach((el) => {
            tripulantesInfos.push(`<br>` + "Nome: " + el.tripulanteNome + " ")
            tripulantesInfos.push("Grau: " + el.tripulanteGrau + " ")
            tripulantesInfos.push("Numero da CIR: " + el.tripulanteNCIR)
        })
        console.log(tripulantes)
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




router.get('/avisoEntrada/:id/pdf', async (req, res) => {
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
        console.log(err)
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/')
    }  
})


router.get('/avisoSaida/:id/pdf', async (req, res) => {
    try{
        const avisoSaidas = await AvisoSaida.findById(req.params.id).lean()
        const embarcacoes = await Embarcacao.findOne({_id: avisoSaidas.embarcacao}).lean()
        const tripulantes = await Tripulante.find({_id: avisoSaidas.saidaTripulantes}).lean()
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
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao gerar PDF')
        res.redirect('/') 
    }
})


module.exports = router