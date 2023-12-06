if (process.env.NODE_ENV == 'production') {
    module.exports = { mongoURI: 'mongodb+srv://kaiosilva:teste123456@cluster0.tzkgl4r.mongodb.net/?retryWrites=true&w=majority' }
} else {
    module.exports = { mongoURI: 'mongodb://0.0.0.0:27017/despache-emb' }
}