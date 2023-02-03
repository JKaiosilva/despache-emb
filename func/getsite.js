const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { use } = require('passport');
require('../models/Medicao')
const Medicao = mongoose.model('medicaos')

const url = 'https://www.marinha.mil.br/chn-6/';


async function getNivel() {
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);

    const dados_ladario = [];
    $('.table-responsive table tbody').each((i, elem) => {
       var data_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-title"]').last().text().replace('\n            ', '').replace('          ', '');
       dados_ladario.push(data_ladario)
       
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var nome_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-esta-o"]').last().text().replace('\n            ', '').replace('          ', '');
        dados_ladario.push(nome_ladario)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var medida_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-altura"]').last().text().replace('\n            ', '').replace('          ', '');
        dados_ladario.push(medida_ladario)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var fonte_ladario = $(elem).find('tr[class="even"] td[class="views-field views-field-field-situa-o-em-rela-o-ao-nr"]').last().text().replace('\n            FONTE : ', '').replace('          ', '');
        dados_ladario.push(fonte_ladario)
    });
     
    //Informações Cuiabá

   const dados_cuiaba = [];
    $('.table-responsive table tbody').each((i, elem) => {
       var data_cuiaba = $(elem).find('tr[class="odd views-row-first"] td[class="views-field views-field-title"]').text().replace('\n            ', '').replace('          ', '');
       dados_cuiaba.push(data_cuiaba)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var nome_cuiaba = $(elem).find('tr[class="odd views-row-first"] td[class="views-field views-field-field-esta-o"]').text().replace('\n            ', '').replace('          ', '');
        dados_cuiaba.push(nome_cuiaba)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var medida_cuiaba = $(elem).find('tr[class="odd views-row-first"] td[class="views-field views-field-field-altura"]').text().replace('\n            ', '').replace('          ', '');
        dados_cuiaba.push(medida_cuiaba)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var fonte_cuiaba = $(elem).find('tr[class="odd views-row-first"] td[class="views-field views-field-field-situa-o-em-rela-o-ao-nr"]').text().replace('\n            FONTE : ', '').replace('           ', '');
        dados_cuiaba.push(fonte_cuiaba)
    });


    const dados_caceres = [];
    $('.table-responsive table tbody').each((i, elem) => {
       var data_caceres = $(elem).find('tr[class="even"] td[class="views-field views-field-title"]').first().text().replace('\n            ', '').replace('          ', '');
       dados_caceres.push(data_caceres)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var nome_caceres = $(elem).find('tr[class="even"] td[class="views-field views-field-field-esta-o"]').first().text().replace('\n            ', '').replace('          ', '');
        dados_caceres.push(nome_caceres)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var medida_caceres = $(elem).find('tr[class="even"] td[class="views-field views-field-field-altura"]').first().text().replace('\n            ', '').replace('          ', '');
        dados_caceres.push(medida_caceres)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var fonte_caceres = $(elem).find('tr[class="even"] td[class="views-field views-field-field-situa-o-em-rela-o-ao-nr"]').first().text().replace('\n            FONTE : ', '').replace('          ', '');
        dados_caceres.push(fonte_caceres)
    });


    const dados_fcoimbra = [];
    $('.table-responsive table tbody').each((i, elem) => {
       var data_fcoimbra = $(elem).find('tr[class="odd"] td[class="views-field views-field-title"]').last().text().replace('\n            ', '').replace('          ', '');
       dados_fcoimbra.push(data_fcoimbra)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var nome_fcoimbra = $(elem).find('tr[class="odd"] td[class="views-field views-field-field-esta-o"]').last().text().replace('\n            ', '').replace('          ', '');
        dados_fcoimbra.push(nome_fcoimbra)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var medida_fcoimbra = $(elem).find('tr[class="odd"] td[class="views-field views-field-field-altura"]').last().text().replace('\n            ', '').replace('          ', '');
        dados_fcoimbra.push(medida_fcoimbra)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var fonte_fcoimbra = $(elem).find('tr[class="odd"] td[class="views-field views-field-field-situa-o-em-rela-o-ao-nr"]').last().text().replace('\n            Fonte: ', '').replace('           ', '');
        dados_fcoimbra.push(fonte_fcoimbra)
    });




    const dados_pmurtinho = [];
    $('.table-responsive table tbody').each((i, elem) => {
       var data_pmurtinho = $(elem).find('tr[class="even views-row-last"] td[class="views-field views-field-title"]').text().replace('\n            ', '').replace('          ', '');
       dados_pmurtinho.push(data_pmurtinho)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var nome_pmurtinho = $(elem).find('tr[class="even views-row-last"] td[class="views-field views-field-field-esta-o"]').text().replace('\n            ', '').replace('          ', '');
        dados_pmurtinho.push(nome_pmurtinho)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var medida_pmurtinho = $(elem).find('tr[class="even views-row-last"] td[class="views-field views-field-field-altura"]').text().replace('\n            ', '').replace('          ', '');
        dados_pmurtinho.push(medida_pmurtinho)
    });
    $('.table-responsive table tbody').each((i, elem) => {
        var fonte_pmurtinho = $(elem).find('tr[class="even views-row-last"] td[class="views-field views-field-field-situa-o-em-rela-o-ao-nr"]').text().replace('\n            FONTE: ', '').replace('          ', '');
        dados_pmurtinho.push(fonte_pmurtinho)
    });



    const novaMedicao = {
        nomeCidade: dados_ladario.nome_ladario +'teste',
        nivelCidade: dados_ladario.medida_ladaio,
        dataAtu: dados_ladario.data_ladario,
        nomeAgencia: dados_ladario.fonte_ladario
    }
    new Medicao(novaMedicao).update().then(()=> {
        console.log('dados cadastrados')
    }).catch((err) => {
        console.log(err)
    })
    
/* 
    const dados_cidades = dados_cuiaba.concat(dados_caceres, dados_ladario, dados_fcoimbra, dados_pmurtinho)

    const enviar_dados = require("./niveis");
    enviar_dados.push(dados_cidades);
    fs.writeFile('func/niveis.json', JSON.stringify(dados_cidades), erro => {
        if (erro) throw erro; 
        console.log("Dados transmitidos com sucesso!");
    });

    */

}


getNivel()
