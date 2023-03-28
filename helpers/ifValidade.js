const Handlebars = require('handlebars')
const moment = require('moment')
const mongoose = require('mongoose')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')




Despacho.find().lean().then((despachos) => {
    despachos.forEach((data)=>{
      globalThis.valor = data.despachoData
        /* console.log(valor) */
    }).then((valor) => {
      Handlebars.registerHelper("ifValidade", function(valor, options) {
        console.log(valor)
        if (valor != 0) {
          console.log(valor)
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    }) 
    })
}).catch(err => {
  console.log(err)
})




