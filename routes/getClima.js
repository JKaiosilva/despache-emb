const axios = require('axios')


const data = async () => {
    await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=-19.0092&lon=-57.6533&lang=pt_br&appid=${process.env.API_KEY}`)
    const climaAtual = data.data.current
    previsaoAmanha: data.data.hourly[0]
    console.log('foi')
}

const tempo = {climaAtual: data.data.current, previsaoAmanha: data.data.hourly[0]}

module.exports = tempo