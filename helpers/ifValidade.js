const Handlebars = require('handlebars')
const moment = require('moment')
const mongoose = require('mongoose')
require('../models/Despacho')
const Despacho = mongoose.model('despachos')





Moment = moment(Date.now()).format('DD/MM/YYYY') 


Despacho.find().lean().then((despachos) => {
    despachos.forEach((data)=>{
        console.log(data.despachoDataPedido)
        return data
  })
})


Handlebars.registerHelper("ifValidade", function(data, options) {
    if (data != Moment) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })





