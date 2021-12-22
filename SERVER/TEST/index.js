var test = require('tape');
var request = require('supertest');
var app = require('../API');
// GET
var parcheggio_id = '61acba7f736680ca6f6e1f52';
test('TEST 1 --> Singolo parcheggio', function(assert)  {
    request(app)
    .get('/api/parcheggi/'+parcheggio_id)
    .expect('Content-Type' , /json/)
    .expect(200)
    .end(function(err, res){
        console.log('\nTEST 1 --> Singolo parcheggio\n');
        if(err){
            Promise.reject(new Error("Errore nella ricezione dei dati utente\n" + err));
        }
        var expected_output = {
            "parcheggio" : {
                "_id": "61acba7f736680ca6f6e1f52",                
                "proprietario_ID": "61b472c0c421271a6aa2d85f",
                "coord_N": 46.06646,
                "coord_E": 11.11515,
                "via": "Via Roberto da Sanseverino",
                "citta": "Trento",
                "nome": "Parcheggio Sanseverino",
                "CAP": "38121",
                "posti_disponibili": 45,
                "posti_totali": 100,
                "tariffa_oraria": 1.5,
                "is_preferito": true
            }
        } //Essendo il campo _id statico controllo solo la sua correttezza, in quanto gli altri campi potrebbero variare
        assert.error(err, 'No error');
        assert.same(res.body.parcheggio._id, expected_output.parcheggio._id, 'Parcheggio ricevuto come previsto');
        assert.end();
    });
});

// POST
var active_user_id = '61b47382c421271a6aa2d86e';
test('TEST 2 --> Aggiorna dati utente', function(assert)  {
    request(app)
    .post('/api/utenti/'+active_user_id)
    .expect(200)
    .send({
        'nome' : 'Antonio_<3',
        'cognome' : 'Bucchiarone',
        'email' : 'ab@unitn.it',
        'data_nascita' : '10/01/2022',
        'targa' : 'AA000AA',
        'carta_credito' : '1919191919191919'
    })
    .end(function(err, res){
        console.log('\nTEST 2 --> Aggiorna dati utente\n');
        if(err){
            Promise.reject(new Error("Errore durante l'inserimento dell'utente\n"+err));
        }
        var expected_output = "Aggiornamento Effettuato";

        assert.error(err, 'No error');
        assert.isEqual(res.text, expected_output, 'Messaggio output corretto');
        assert.end();
    });
});


//modificare "pren_id_test" per altri test 
var pren_id_test = {
    '_1' : '61c2fd2d193c1586ea726f8b',
    '_2' : '61c2fd27193c1586ea726f8a',
    '_3' : '61c2fd22193c1586ea726f89'
}

// DELETE
test('TEST 3 --> Elimina prenotazione', function(assert)  {
    request(app)
    .delete('/api/prenotazioni/'+pren_id_test._2)
    .expect(200)
    .end(function(err, res){
        console.log('\nTEST 3 --> Elimina prenotazione\n');
        if(err){
            Promise.reject(new Error("Errore durante la cancellazione della prenotazione\n" + err));
        }
        var expected_output = 'Prenotazione eliminata con successo!';

        assert.error(err, 'No error');
        assert.isEqual(res.text, expected_output, 'Prenotazione eliminata');
        assert.end();
    });
});
