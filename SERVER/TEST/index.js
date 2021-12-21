var active_user_id = '61acb903736680ca6f6e1f3f';
var parcheggio_id = '61acba7f736680ca6f6e1f52';


var test = requite('tape');
var request = require('supertest');
var app = require('../API');

test('Correct users returned', function(t)  {
    request(app)
    .get('api/parcheggi/'+parcheggio_id)
    .expect('Content-Type' , /json/)
    .expect(200)
    .end(function(err, res){

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
                "is_preferito": false
            }       
        }

        t.error(err, 'No error');
        t.same(res.body, expected_output, 'Parcheggio ricevuto come previsto');
        t.end();
    });
});