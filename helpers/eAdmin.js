
module.exports = {
    Admin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == true) {
            return next();
        }
        req.flash('error_msg', 'Você não tem autorização para acessar esta página!')
        res.redirect('/')
    }
}