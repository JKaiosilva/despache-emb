const Handlebars = require("handlebars");

const each = Handlebars.precompile('{{#each tripulantes}}')
const id = Handlebars.precompile('{{_id}}')
const tripulanteNome = Handlebars.precompile('{{tripulanteNome}}')
const fimEach = Handlebars.precompile('{{/each}}')


var divCounter = 0
    function addInputSelect(divName) {
    var newdiv = document.createElement('div');
    var divId = "div" + divCounter
    newdiv.setAttribute('id', divId)
    newdiv.innerHTML = `<select name="tripulante" class="btn-group"><option id="emBranco" value="emBranco">Em Branco</option>${each}<option id="tripulante" value="${id}">${tripulanteNome}</option>${fimEach}</select><button class="btn btn-danger btn-sm m-4" style="float: end" type="button" onclick="deleteBranco(\'' + divId + '\')">Excluir</button>`;                            
    document.getElementById(divName).appendChild(newdiv);
    document.getElementById('selecaoTripulantes').setAttribute('class', 'bg')
    var submiteButton = document.getElementById('submitButton')
    submiteButton.disabled = true
    divCounter++;
    document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-danger bg-opacity-50 border-danger')

    }

    function deleteBranco(divId){
        tripulantesArray = []
        var emBranco = document.getElementById(divId)
        emBranco.remove()
        document.getElementById('selecaoTripulantes').setAttribute('class', 'bg')
        var submiteButton = document.getElementById('submitButton')
        submiteButton.disabled = true
        document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-danger bg-opacity-50 border-danger')
    }

    addInputSelect('lines');

    function getId(){
    
    var submiteButton = document.getElementById('submitButton')
    submiteButton.disabled = false

    var tripulantesArray = []

    var tripulantesIds = document.querySelectorAll("[name='tripulante']")
                for (var i = 0; i < tripulantesIds.length; i++) {
                    if(tripulantesIds[i].value == 'emBranco'){
                        var submiteButton = document.getElementById('submitButton')
                        submiteButton.disabled = true
                        
                    }
            tripulantesArray.push(tripulantesIds[i].value)
            document.getElementById('tripulantesArrayIds').setAttribute('value', `${tripulantesArray}`)
        }
        if(tripulantesArray.length == 0 ){
            var submiteButton = document.getElementById('submitButton')
            submiteButton.disabled = true
            document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-danger bg-opacity-50 border-danger')
        }
        if(tripulantesArray.find(el => el == 'emBranco')){
            document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-danger bg-opacity-50 border-danger')
        }else{
            document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-success bg-opacity-50 border-success')
        }
        console.log(tripulantesArray)
    
        
    }
    function deleteTripulante(id){
        var submiteButton = document.getElementById('submitButton')
        submiteButton.disabled = true
        tripulantesArray = []
        document.getElementById(id).remove()
        document.getElementById('selecaoTripulantes').setAttribute('class', 'bg')
        document.getElementById('selecaoTripulantes').setAttribute('class', 'form-control bg-danger bg-opacity-50 border-danger')
    }