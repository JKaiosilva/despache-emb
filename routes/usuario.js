const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Usuario')
require('../models/Embarcacao')

const Usuario = mongoose.model('usuarios')
const Embarcacao = mongoose.model('embarcacoes')

const passport = require('passport')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const {eUser} = require('../helpers/eUser')
const jwt = require('jsonwebtoken')

// Cadatro de usuário





// Login usuario



// Logout usuário 


// Perfil usuário




module.exports = router



