const bcrypt = require('bcryptjs');
require('dotenv').config();


async function criarHashOficial(user) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(process.env.OFICIAL_KEY, salt, (err, hash) => {
        user.perm = hash
    })
  })
}


async function verificarHashOficial(keyOficial, hashOficial) {
    try {
      
      const correspondencia = await bcrypt.compare(keyOficial, hashOficial);
      return next;
    } catch (error) {
      throw new Error('Erro ao verificar a senha: ' + error);
    }
  }


module.exports = criarHashOficial;