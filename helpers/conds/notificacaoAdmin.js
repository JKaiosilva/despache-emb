const mongoose = require('mongoose');
require('../../models/Despacho')
const Despacho = mongoose.model('despachos')


const notifiCheck = async (req, res, next) => {
    const notificado = await Despacho.find({despachoNaoEditado: 1}).count()
    return notificado;
}

module.exports = notifiCheck