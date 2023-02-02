setInterval(carregar_info, 5000)


 function carregar_info(){
 fecth("./niveis.json")
.then(response => {
        return response.json();
})
.then(jsondata => {
    document.getElementById('nome_cuiaba').innerHTML = jsondata[1];
    document.getElementById('nivel_cuiaba').innerHTML = jsondata[2];
    document.getElementById('att_cuiaba').innerHTML = jsondata[0];
    document.getElementById('fonte_cuiaba').innerHTML = jsondata[3];

    document.getElementById('nome_caceres').innerHTML = jsondata[5];
    document.getElementById('nivel_caceres').innerHTML = jsondata[6];
    document.getElementById('att_caceres').innerHTML = jsondata[4];
    document.getElementById('fonte_caceres').innerHTML = jsondata[7];

    document.getElementById('nome_ladario').innerHTML = jsondata[9];
    document.getElementById('nivel_ladario').innerHTML = jsondata[10];
    document.getElementById('att_ladario').innerHTML = jsondata[8];
    document.getElementById('fonte_ladario').innerHTML = jsondata[11];

    document.getElementById('nome_fcoimbra').innerHTML = jsondata[13];
    document.getElementById('nivel_fcoimbra').innerHTML = jsondata[14];
    document.getElementById('att_fcoimbra').innerHTML = jsondata[12];
    document.getElementById('fonte_fcoimbra').innerHTML = jsondata[15];

    document.getElementById('nome_pmurtinho').innerHTML = jsondata[17];
    document.getElementById('nivel_pmurtinho').innerHTML = jsondata[18];
    document.getElementById('att_pmurtinho').innerHTML = jsondata[16];
    document.getElementById('fonte_pmurtinho').innerHTML = jsondata[19];


    console.log(jsondata)


}).catch((err) => {
    console.log(err)
});
}