const Handlebars = require('handlebars')
const moment = require('moment')

Moment = moment(Date.now()).format('DD/MM/YYYY')

var despachos = despachos.despachoDataPedido

module.exports = 
Handlebars.registerHelper("ifValidade", function(despachos, Moment, options) {
    if (Moment == despachos) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })
