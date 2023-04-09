if(process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: 'mongodb+srv://kaioSilva:Tb1f4O8YzZPEfn4A@cluster0.wbi0j96.mongodb.net/?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://0.0.0.0:27017/despache-emb'}
}