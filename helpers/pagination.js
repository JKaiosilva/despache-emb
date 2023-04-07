const express = require('express')

const pagination = ((req, res) => {
    const page = req.params.page || 1
    const limit = 5
    const skip = (page - 1) * limit
    var prePage = ''


        nextPage = `${prePage}/${page}`


})

module.exports = pagination