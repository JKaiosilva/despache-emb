const axios = require('axios')
const fs = require('fs')
require('dotenv').config();

const API_KEY = process.env.API_KEY

module.exports = {
    getClima: axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=-19.0092&lon=-57.6533&appid=${API_KEY}`)
    .then((response) => {
        const climaAtual = response.data.current
        const previsaoAmanha = response.data.hourly
        
    })
}



