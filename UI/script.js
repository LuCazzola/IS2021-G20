var active_user_id = '61acb903736680ca6f6e1f3f';

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
        }
        else {
            alert(this.response);
        }
    }

    request.send(JSON.stringify(data));
}

function getPrenotazioni(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:5000/api/prenotazioni/'+active_user_id, true);
    var data;
    request.onload = function () {
        data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400){
            data.forEach(pren => {
                document.getElementById("card-container").innerHTML += '<div class="card"><div class="campo"><text>Nome Parcheggio</text><input type="text" value="'+pren.nome_parcheggio+'" readonly></input></div><div class="campo"><text>Giorno</text><input type="text" value="'+pren.giorno+'" readonly></input></div><div class="campo"><text>Ora inizio</text><input type="text" value="'+pren.ora_inizio+'" readonly></input></div><div class="campo"><text>Ora fine</text><input type="text" value="'+pren.ora_fine+'" readonly></input></div><div class="campo"><text>Costo</text><input type="text" value="'+pren.costo+'" readonly></input></div><input type="button" value="ELIMINA" class="delete" onclick=""></input></div>';
            });
        }
        else {
            console.log("Request Status -> " + request.status + "\nAPI not Working!!!");
        }
    }
    request.send();
}

