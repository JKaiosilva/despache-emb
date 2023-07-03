
module.exports = {
    eAgencia: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAgencia == 1) {
            return next();
        }
        req.flash('error_msg', 'Você não tem autorização para acessar esta página!')
        res.redirect('/')
    }
}