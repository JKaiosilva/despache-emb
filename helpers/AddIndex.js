const Handlebars = require("handlebars");


module.exports = 
Handlebars.registerHelper("add", function(a, b) {
    return a + b;
  })