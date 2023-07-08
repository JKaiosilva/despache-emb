const Handlebars = require("handlebars");

module.exports = 
Handlebars.registerHelper("ifDespachante", function(user, options) {
    if (user && user.eUser) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

