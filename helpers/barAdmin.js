const handlebars = require("express-handlebars");

Handlebars.registerHelper("ifAdmin", function(user, options) {
    if (user && user.eAdmin) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });