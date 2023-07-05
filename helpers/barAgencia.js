const Handlebars = require("handlebars");

module.exports = 
Handlebars.registerHelper("ifAgencia", function(user, options) {
    if (user && user.eAgencia) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })

