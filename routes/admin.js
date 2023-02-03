const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {eAdmin} = require('../helpers/eAdmin')



router.get('admin/avisos', eAdmin, (req, res) => {
    res.render('admin/avisos')
})


module.exports = router