const Handlebars = require('handlebars')
const moment = require('moment')
const mongoose = require('mongoose')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')




/* Despacho.find().lean().then((despachos) => {
    despachos.forEach((data)=>{
      globalThis.valor = data.despachoData
        /* console.log(valor)
    })
  })
*/


Handlebars.registerHelper("ifValidade", function(options) {
        if (0 != 0) {
          console.log(valor)
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
}) 



