var active_user_id = '61acb903736680ca6f6e1f3f';
getUserName();

function getUserName(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:5000/api/utenti/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){      
            document.getElementById('active_user_name').innerHTML = data.nome +" "+data.cognome;
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}


function getUserData(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:5000/api/utenti/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){      
            document.getElementById('nome').setAttribute('value', data.nome );
            document.getElementById('cognome').setAttribute('value', data.cognome );
            document.getElementById('email').setAttribute('value', data.email );
            document.getElementById('data_nascita').setAttribute('value', data.data_nascita );
            document.getElementById('targa').setAttribute('value', data.targa );
            document.getElementById('carta_credito').setAttribute('value', data.carta_credito );
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}

function setUserData(){    
    var request = new XMLHttpRequest();

    request.open('POST', 'http://localhost:5000/api/utenti/'+active_user_id, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var data = {
        "nome" : document.getElementById('nome').value,
        "cognome" : document.getElementById('cognome').value,
        "email" : document.getElementById('email').value,
        "data_nascita" : document.getElementById('data_nascita').value,
        "targa" : document.getElementById('targa').value,
        "carta_credito" : document.getElementById('carta_credito').value
    };

    request.onload = function () {
        
        if (request.status >= 200 && request.status < 400){      
            alert("Utente aggiornato con successo!");
            location.reload();
        }
        else {
            alert(this.response);
        }
    }

    request.send(JSON.stringify(data));
}

//Tutte le prenotazioni esistenti di un utente
function getPrenotazioni(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:5000/api/prenotazioni/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){
            data.forEach(pren => {
                var inner_pren = "deletePrenotazione('"+pren._id+"')";
                document.getElementById("card-container").innerHTML += '<div class="card"><div class="campo"><text>Nome Parcheggio</text><input type="text" value="'+pren.nome_parcheggio+'" readonly></input></div><div class="campo"><text>Giorno</text><input type="text" value="'+pren.giorno+'" readonly></input></div><div class="campo"><text>Ora inizio</text><input type="text" value="'+pren.ora_inizio+'" readonly></input></div><div class="campo"><text>Ora fine</text><input type="text" value="'+pren.ora_fine+'" readonly></input></div><div class="campo"><text>Costo</text><input type="text" value="'+pren.costo+'" readonly></input></div><input type="button" value="ELIMINA" class="delete" onclick="'+inner_pren+'"></input></div>';
            });
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}

function deletePrenotazione(idPren){
    var request = new XMLHttpRequest();

    request.open('DELETE', 'http://localhost:5000/api/prenotazioni/'+idPren, true);

    request.onload = function () {
        
        if (request.status >= 200 && request.status < 400){      
            alert(this.response);
            location.reload();
        }
        else {
            alert(this.response);
        }
    }

    request.send();
}

//Aggiungere una prenotazione
function addPrenotazione (idPark, nomePark, tariffa){
    var request = new XMLHttpRequest();

    var ore = parseInt(document.getElementById("tempo_sosta").value);

    var data ={
        'utente_ID' : active_user_id,
        'id_parcheggio' : idPark,
        'nome_parcheggio' : nomePark,
        'ore' : ore,
        'tariffa' : parseFloat(tariffa)
    }

    request.open('POST', 'http://localhost:5000/api/prenotazioni', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function () {
        
        if (request.status >= 200 && request.status < 400){      
            alert(this.response);
            document.getElementById('parcheggioHighLight').setAttribute('class','hide');
        }
        else {
            alert(this.response);
        }
    }

    request.send(JSON.stringify(data));
}


function switchStar (idPark, update) {
    var request = new XMLHttpRequest();

    request.open('POST', 'http://localhost:5000/api/parcheggi/preferiti/'+idPark+'/'+update, true);

    request.onload = function () {
        
        if (request.status >= 200 && request.status < 400){      
            alert(this.response);
        }
        else {
            alert(this.response);
        }
    }

    request.send();
}

function getFilteredParcheggi (){
    var request = new XMLHttpRequest();

    var data = {
        'nome' : document.getElementById('cerca').value,
        'tariffa' : parseFloat(document.getElementById('tariffa_value').innerHTML),
        'preferiti' : (document.getElementById('star_filter').getAttribute('src') == 'IMG/start.svg')
    };

    request.open('GET', 'http://localhost:5000/api/parcheggi/filtri?nome='+data.nome+'&tariffa='+data.tariffa+'&preferiti='+data.preferiti, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400){
            data = JSON.parse(this.response)      
            if(data.length > 0){
                document.getElementById("searchResults").innerHTML = "";

                data.forEach(park => {
                    onclick_inner = "open_park('"+park._id+"')";
                    document.getElementById("searchResults").innerHTML += '<div class="row" onclick = "'+onclick_inner+'"><text>'+park.nome+'</text><text>'+park.tariffa_oraria+' €/h</text></div><hr>'
                });
                document.getElementById("searchResults").setAttribute("class","show");
            }
            else{
                alert("Nessun parcheggio rispetta i criteri scelti !!!");
            }
        }
        else {
            alert(this.response);
        }
    }

    request.send();
}

function open_park(park_id){
    document.getElementById("searchResults").setAttribute("class","hide");
    var highLight = document.getElementById('parcheggioHighLight');

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:5000/api/parcheggi/'+park_id, true);  
    
    request.onload = function () {
        park = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){

            var star_extension = "";
            if(!park.is_preferito){
                star_extension = "-no";
            }
            var onclickText = " modifyParkStar('"+park._id+"');";

            var inner_pren = "addPrenotazione ('"+park._id+"', '"+park.nome+"', '"+park.tariffa_oraria+"')";

            highLight.innerHTML = '<div class="row"><h1 id="nome_parcheggio">'+park.nome+'</h1><br><img src="IMG/star'+star_extension+'.svg" id="star_'+park._id+'" onclick="'+onclickText+'"></div><br><div class="row"><text>posti disponibili</text><text id="posti_disp">NAN</text></div><div class="row"><text>distanza</text><text id="distanza">NAN</text></div><div class="row"><text>prezzo</text><text id="prezzo">'+park.tariffa_oraria+'</text></div><div class="row"><text>Tempo di sosta</text><text id="tempo_sosta_value">2</text></div><input id="tempo_sosta" type="range" min="1" max="100" value="2" oninput="updateTempoSosta()"><input type="button" value="Prenota" id="prenota" onclick="'+inner_pren+'" ><input type="hidden" id="key_parcheggio" value="'+park._id+'"></input>' 
            highLight.setAttribute('class','show');
        }
        else {
            alert(this.response);
        }
    }
    request.send();
}