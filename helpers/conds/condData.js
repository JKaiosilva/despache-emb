const moment = require('moment');

function checaData(data){
    if(data == 0){
        return 'Em análise'
    }
    return moment(parseInt(data)).format('DD/MM/YYYY');
}


module.exports = checaData;