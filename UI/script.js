var curr_Nord = 46.063561;
var curr_Est = 11.119344;
var active_user_id = '61acb903736680ca6f6e1f3f';
getUserName();

function getUserName(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:49126/api/utenti/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){      
            document.getElementById('active_user_name').innerHTML = data.utente.nome +" "+data.utente.cognome;
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}


function getUserData(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:49126/api/utenti/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){      
            document.getElementById('nome').setAttribute('value', data.utente.nome );
            document.getElementById('cognome').setAttribute('value', data.utente.cognome );
            document.getElementById('email').setAttribute('value', data.utente.email );
            document.getElementById('data_nascita').setAttribute('value', data.utente.data_nascita );
            document.getElementById('targa').setAttribute('value', data.utente.targa );
            document.getElementById('carta_credito').setAttribute('value', data.utente.carta_credito );
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}

function setUserData(){    
    var request = new XMLHttpRequest();

    request.open('POST', 'http://localhost:49126/api/utenti/'+active_user_id, true);
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

    request.open('GET', 'http://localhost:49126/api/prenotazioni/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){
            data.prenotazioni.forEach(pren => {
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

    request.open('DELETE', 'http://localhost:49126/api/prenotazioni/'+idPren, true);

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
        'nome_parcheggio' : nomePark,
        'ore' : ore,
        'tariffa' : parseFloat(tariffa)
    }

    request.open('POST', 'http://localhost:49126/api/prenotazioni/'+active_user_id+'/'+idPark, true);
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

    request.open('POST', 'http://localhost:49126/api/parcheggi/preferiti/'+idPark+'/'+update, true);

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

    request.open('GET', 'http://localhost:49126/api/parcheggi/filtri?nome='+data.nome+'&tariffa='+data.tariffa+'&preferiti='+data.preferiti, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400){
            data = JSON.parse(this.response)      
            if(data.length > 0){
                document.getElementById("searchResults").innerHTML = "";
                
                data.parcheggi.forEach(park => {
                    var distance = getDistanceFromLatLonInKm(curr_Nord, curr_Est, park.coord_N, park.coord_E).toFixed(2);
                    if(distance < document.getElementById("raggio_range").value){
                        var onclick_inner = "open_park('"+park._id+"')";
                        var star_extension = "";
                        if(!park.is_preferito){
                            star_extension = "-no";
                        }            

                        document.getElementById("searchResults").innerHTML += '<div class="row" onclick = "'+onclick_inner+'"><text>'+park.nome+'</text><text>'+park.tariffa_oraria+' €/h</text><img src="IMG/star'+star_extension+'.svg" id="star_'+park._id+'"></div><hr>'
                    }
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
    request.open('GET', 'http://localhost:49126/api/parcheggi/'+park_id, true);  
    
    request.onload = function () {
        park = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){

            var star_extension = "";
            if(!park.parcheggio.is_preferito){
                star_extension = "-no";
            }
            var onclickText = " modifyParkStar('"+park.parcheggio._id+"');";
            var inner_pren = "addPrenotazione ('"+park.parcheggio._id+"', '"+park.parcheggio.nome+"', '"+park.parcheggio.tariffa_oraria+"')";
            var distance = getDistanceFromLatLonInKm(curr_Nord, curr_Est, park.parcheggio.coord_N, park.parcheggio.coord_E).toFixed(2);

            highLight.innerHTML = '<div class="row"><h1 id="nome_parcheggio">'+park.parcheggio.nome+'</h1><br><img src="IMG/star'+star_extension+'.svg" id="star_'+park.parcheggio._id+'" class="star_style" onclick="'+onclickText+'"></div><br><div class="row"><text>posti disponibili</text><text id="posti_disp">'+park.parcheggio.posti_disponibili+'</text></div><div class="row"><text>distanza</text><text id="distanza">'+distance+' Km</text></div><div class="row"><text>prezzo</text><text id="prezzo">'+park.parcheggio.tariffa_oraria+' €/h</text></div><div class="row"><text>Tempo di sosta</text><text id="tempo_sosta_value">2 h</text></div><input id="tempo_sosta" type="range" min="1" max="48" value="2" oninput="updateTempoSosta()"><input type="button" value="Prenota" id="prenota" onclick="'+inner_pren+'" ><input type="hidden" id="key_parcheggio" value="'+park.parcheggio._id+'"></input>' 
            highLight.setAttribute('class','show');
        }
        else {
            alert(this.response);
        }
    }
    request.send();
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }