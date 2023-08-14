


const condicaoDocumento = async (documentoEditado, documentoValidade) => {
    if(documentoEditado != 1 && documentoValidade >= Date.now()){
        return editado = 'Validado'
    }else if(documentoEditado == 1){
        return editado = 'Em análise';
    }
    return editado = 'Não validado'
}

module.exports = condicaoDocumento;