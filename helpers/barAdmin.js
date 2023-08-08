const Handlebars = require("handlebars");

module.exports = 
Handlebars.registerHelper("ifAdmin", function(user, options) {
    if (user && user.eAdmin || user && user.oficial || user && user.operador) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

