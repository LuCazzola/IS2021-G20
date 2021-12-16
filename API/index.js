const Express = require("express");
const app = Express();

// modules to generate APIs documentation
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express APIs Smart Parking App',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'GruppoG20',
                url: 'http://localhost:49146/',
            },
        },
        servers: [
            {
                url: 'http://localhost:49146/',
                description: 'Development server',
            },
        ],
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/Api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}


var MongoClient = require("mongodb").MongoClient;
var CONNECTION_STRING = "mongodb+srv://G20:G19@cluster0.ditxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var DB = "smartparking";
var database;

var ObjectID = require('mongodb').ObjectId;

var Express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//DEFAULT CONNECTION
app.listen(5000, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, 
    useUnifiedTopology: true }, (error, client) => {
      if(error){
        console.log("ERROR: " + error);
      }
      else{
        database = client.db(DB);
        console.log("CONNESSIONE RIUSCITA");
      }
    })
});

//Tutti i parcheggi
/**
 * @swagger
 * /api/parcheggi: 
 *   get:
 *     summary: Restituisce una lista di parcheggi.
 *     description: Restituisce una lista di parcheggi dal server.
 *     responses:
 *       200:
 *         description: Una lista di parcheggi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61acba7f736680ca6f6e1f52
 *                       proprietario_ID:
 *                         type: string
 *                         description: ID del proprietario.
 *                         example: 61b472c0c421271a6aa2d85f
 *                       coord_N:
 *                          type: float
 *                          description: Latitudine del parcheggio
 *                          example: 46.06646
 *                       coord_E:
 *                          type: float
 *                          description: Longitudine del parcheggio
 *                          example: 11.11515
 *                       via:
 *                          type: string
 *                          description: Via nel quale è situato il parcheggio
 *                          example: Via Roberto da Sanseverino
 *                       citta:
 *                          type: string
 *                          description: Città nel quale è situato il parcheggio
 *                          example: Trento
 *                       nome:
 *                          type: string
 *                          description: Nome del parcheggio
 *                          example: Parcheggio Sanseverino
 *                       CAP:
 *                          type: integer
 *                          description: CAP del parcheggio
 *                          example: 38121
 *                       posti_disponibili:
 *                          type: integer
 *                          description: Numero di posti attualmente disponibili
 *                          example: 45
 *                       posti_totali:
 *                          type: integer
 *                          description: Numero di posti totali del parcheggio
 *                          example: 100
 *                       tariffa_oraria:
 *                          type: float
 *                          description: Tariffa oraria del parcheggio
 *                          example: 1.5
 *                       is_preferito:
 *                          type: boolean
 *                          description: booleano di appartenenza ai "preferiti" del singolo utente. (deriva da una semplificazione del database)
 *                          example: false
 */
app.get('/api/parcheggi', (request, response) => {
  database.collection("parcheggi").find({}).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});

//parcheggi con filtri
/**
 * @swagger
 * /api/parcheggi/{id}: 
 *   get:
 *     summary: Restituisce una lista di parcheggi selezionadoli attraverso dei filtri.
 *     description: Restituisce una lista di parcheggi dal server.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         description: id del parcheggio.
 *     responses:
 *       200:
 *         description: Una lista di parcheggi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61acba7f736680ca6f6e1f52
 *                       proprietario_ID:
 *                         type: string
 *                         description: ID del proprietario.
 *                         example: 61b472c0c421271a6aa2d85f
 *                       coord_N:
 *                          type: float
 *                          description: Latitudine del parcheggio
 *                          example: 46.06646
 *                       coord_E:
 *                          type: float
 *                          description: Longitudine del parcheggio
 *                          example: 11.11515
 *                       via:
 *                          type: string
 *                          description: Via nel quale è situato il parcheggio
 *                          example: Via Roberto da Sanseverino
 *                       citta:
 *                          type: string
 *                          description: Città nel quale è situato il parcheggio
 *                          example: Trento
 *                       nome:
 *                          type: string
 *                          description: Nome del parcheggio
 *                          example: Parcheggio Sanseverino
 *                       CAP:
 *                          type: integer
 *                          description: CAP del parcheggio
 *                          example: 38121
 *                       posti_disponibili:
 *                          type: integer
 *                          description: Numero di posti attualmente disponibili
 *                          example: 45
 *                       posti_totali:
 *                          type: integer
 *                          description: Numero di posti totali del parcheggio
 *                          example: 100
 *                       tariffa_oraria:
 *                          type: float
 *                          description: Tariffa oraria del parcheggio
 *                          example: 1.5
 *                       is_preferito:
 *                          type: boolean
 *                          description: booleano di appartenenza ai "preferiti" del singolo utente. (deriva da una semplificazione del database)
 *                          example: false
 */
app.get('/api/parcheggi/:id', (request, response) => {
  var filters = {
    "nome" : request.body['nome'],
    "tariffa" : request.body['tariffa'],
    "preferiti" : request.body['preferiti']
  };

  database.collection("parcheggi").find({

    "nome" : { $regex: ".*" + filters.nome + ".*" },
    "tariffa" : { $lte: filters.tariffa},
    "preferiti" : filters.preferiti

  }).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});


//parcheggio singolo
/**
 * @swagger
 * /api/parcheggi/parcheggio/{id}:
 *   get:
 *     summary: Restituisce un singolo parcheggio.
 *     description: Restituisce un singolo parcheggio dal server.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         description: id del parcheggio
 *     responses:
 *       200:
 *         description: Un oggetto parcheggio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61acba7f736680ca6f6e1f52
 *                       proprietario_ID:
 *                         type: string
 *                         description: ID del proprietario.
 *                         example: 61b472c0c421271a6aa2d85f
 *                       coord_N:
 *                          type: float
 *                          description: Latitudine del parcheggio
 *                          example: 46.06646
 *                       coord_E:
 *                          type: float
 *                          description: Longitudine del parcheggio
 *                          example: 11.11515
 *                       via:
 *                          type: string
 *                          description: Via nel quale è situato il parcheggio
 *                          example: Via Roberto da Sanseverino
 *                       citta:
 *                          type: string
 *                          description: Città nel quale è situato il parcheggio
 *                          example: Trento
 *                       nome:
 *                          type: string
 *                          description: Nome del parcheggio
 *                          example: Parcheggio Sanseverino
 *                       CAP:
 *                          type: integer
 *                          description: CAP del parcheggio
 *                          example: 38121
 *                       posti_disponibili:
 *                          type: integer
 *                          description: Numero di posti attualmente disponibili
 *                          example: 45
 *                       posti_totali:
 *                          type: integer
 *                          description: Numero di posti totali del parcheggio
 *                          example: 100
 *                       tariffa_oraria:
 *                          type: float
 *                          description: Tariffa oraria del parcheggio
 *                          example: 1.5
 *                       is_preferito:
 *                          type: boolean
 *                          description: booleano di appartenenza ai "preferiti" del singolo utente. (deriva da una semplificazione del database)
 *                          example: false
 */
app.get('/api/parcheggi/parcheggio/:id', (request, response) => {
  database.collection('parcheggi').findOne({ "_id" : ObjectID(request.params.id) }, function (error, result){
    if(error){
      console.log(error);
    }
    response.send(result);
  });
});


//Aggiornamento preferiti parcheggio
/**
 * @swagger
 * /api/parcheggi/preferiti/{id}/update:
 *   post:
 *     summary: Aggiorna un parcheggio come preferito.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               $oid:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: 61acb216736680ca6f6e1f14
 *     responses:
 *       201:
 *         description: successful executed
*/
app.post('/api/parcheggi/preferiti/:id/:update', (request, response) => {
 
  var data = {
    is_preferito : (request.params.update == "true")
  }

  database.collection('parcheggi').updateOne({ "_id" : ObjectID(request.params.id) },{ $set : data}, function(error, result) {
    if(error){
      console.log(error);
      response.send("Aggiornamento FALLITO");
    }
    response.send("Aggiornamento Effettuato: "+request.params.update);
  });
});




//Dati di un singolo utente
/**
 * @swagger
 * /api/utenti/{id}:
 *   get:
 *     summary: Restituisce i dati di un singolo Utente.
 *     description: Restituisce un singolo parcheggio dal server.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: id di un utente.
 *     responses:
 *       200:
 *         description: Un oggetto parcheggio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61acb216736680ca6f6e1f14
 *                       CF:
 *                         type: string
 *                         description: CF dell'utente.
 *                         example: ABCDEF01G23H456I
 *                       nome:
 *                          type: string
 *                          description: Nome dell'utente
 *                          example: Mario
 *                       cognome:
 *                          type: string
 *                          description: Cognome dell'utente
 *                          example: Rossi
 *                       email:
 *                          type: string
 *                          description: E-mail dell'utente
 *                          example: mr_nobody@gmail.com
 *                       password:
 *                          type: string
 *                          description: Password dell'utente
 *                          example: prova1234!
 *                       data_nascita:
 *                          type: string
 *                          description: Data di nascita dell'utente
 *                          example: 17/12/2021
 *                       targa:
 *                          type: string
 *                          description: targa del veicolo dell'utente
 *                          example: EG512PT
 *                       carta_credito:
 *                          type: integer
 *                          description: Codice della carta di credito dell'utente
 *                          example: 4444333322221111
 *                       credito_wallet:
 *                          type: float
 *                          description: Credito attuale del wallet dell'utente
 *                          example: 11.75                      
 */
app.get('/api/utenti/:id', (request, response) => {
  database.collection('utenti').findOne({ "_id" : ObjectID(request.params.id) }, function (error, result){
    if(error){
      console.log(error);
    }
    response.send(result);
  });
});





//prendo tutte le prenotazioni di un utente specifico
/**
 * @swagger
 * /api/prenotazioni/{id}: 
 *   get:
 *     summary: Restituisce una lista di prenotazioni di un utente specifico.
 *     description: Restituisce una lista di prenotazioni dal server.
 *      parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: id di un utente.
 *     responses:
 *       200:
 *         description: Una lista di prenotazioni.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61b4ec5ac421271a6aa2d8e0
 *                       utente_ID:
 *                         type: string
 *                         description: ID di un utente.
 *                         example: 61b47382c421271a6aa2d86e
 *                       id_parcheggio:
 *                          type: string
 *                          description: ID di un parcheggio
 *                          example: 61acba7f736680ca6f6e1f52
 *                       giorno:
 *                          type: string
 *                          description: Data della prenotazione
 *                          example: 2021-11-11
 *                       ora_inizio:
 *                          type: string
 *                          description: Ora di inizio della prenotazione
 *                          example: 10:30
 *                       ora_fine:
 *                          type: string
 *                          description: Ora di fine della prenotazione
 *                          example: 12:00
 *                       costo:
 *                          type: float
 *                          description: Costo della prenotazione
 *                          example: 2.25
 */
app.get('/api/prenotazioni/:id', (request, response) => {
  database.collection("prenotazioni").find({ 'utente_ID' : request.params.id }).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});






//Nuova prenotazione
/**
 * @swagger
 * /api/prenotazioni:
 *   post:
 *     summary: Creo una nuova prenotazione.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                       $oid:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61b4ec5ac421271a6aa2d8e0
 *                       utente_ID:
 *                         type: string
 *                         description: ID di un utente.
 *                         example: 61b47382c421271a6aa2d86e
 *                       id_parcheggio:
 *                          type: string
 *                          description: ID di un parcheggio
 *                          example: 61acba7f736680ca6f6e1f52
 *                       giorno:
 *                          type: string
 *                          description: Data della prenotazione
 *                          example: 2021-11-11
 *                       ora_inizio:
 *                          type: string
 *                          description: Ora di inizio della prenotazione
 *                          example: 10:30
 *                       ora_fine:
 *                          type: string
 *                          description: Ora di fine della prenotazione
 *                          example: 12:00
 *                       costo:
 *                          type: float
 *                          description: Costo della prenotazione
 *                          example: 2.25
 *     responses:
 *       201:
 *         description: successful executed
*/
app.post('/api/prenotazioni', (request, response) => {
  var today = new Date()
  var now = today.getHours()+":"+today.getMinutes();
  var actualDay = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();

  today.addHours(request.body['ore']);
  var later = today.getHours()+":"+today.getMinutes();
  var costo = request.body['ore']*request.body['tariffa'];
  
  var data = {
    "utente_ID" : request.body['utente_ID'],
    "id_parcheggio" : request.body['id_parcheggio'],
    "nome_parcheggio" : request.body['nome_parcheggio'], 
    "giorno" : actualDay,
    "ora_inizio" : now,
    "ora_fine" : later,
    "costo" : costo
  };

  database.collection("prenotazioni").insertOne(data, function(error, result){ 
    if(error){
      console.log(error);
    }
    response.send("Prenotazione aggiunta con successo!\nPuoi visualizzarla alla sezione 'Prenotazioni'");
  })
});





//elimino la prenotazione dell'utente
/**
 * @swagger
 * /api/prenotazioni/{id_pren}:
 *   delete:
 *     summary: Elimino la prenotazione selezionata.
 *     parameters:
 *       - in: path
 *         name: id_pren
 *         schema:
 *             type: string
 *         required: true
 *         description: 
 *     responses:
 *       200:
 *         description: the product was deleted
 *       404:
 *         description: the product was not found
*/
app.delete('/api/prenotazioni/:id_pren', (request, response) => {
  database.collection("prenotazioni").deleteOne({ "_id" : ObjectID(request.params.id_pren) }, function (error, result){
    if(error){
      console.log(error);
    }
    response.send("Prenotazione eliminata con successo!");
  });
});





//Modifica specifico utente
/**
 * @swagger
 * /api/utenti/{id}:
 *   post:
 *     summary: Modifico uno specifico utente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               $oid:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: 61acb216736680ca6f6e1f14
 *     responses:
 *       201:
 *         description: successful executed
*/
app.post('/api/utenti/:id', (request, response) => {
  var data = {
    "nome" : request.body['nome'],
    "cognome" : request.body['cognome'],
    "email" : request.body['email'],
    "data_nascita" : request.body['data_nascita'],
    "targa" : request.body['targa'],
    "carta_credito" : request.body['carta_credito']
  };
  


  
  //Spazi bianchi capo-coda stringa
  data.nome = data.nome.trim();
  data.cognome = data.cognome.trim();
  data.email = data.email.trim();
  data.data_nascita = data.data_nascita.trim();
  data.targa = data.targa.trim();
  data.carta_credito = data.carta_credito.trim();

  if(data.nome == "" || data.cognome == "" || data.email == "" || data.data_nascita == "" || data.targa == "" || data.carta_credito == ""){
    response.status(400).send("I campi non possono essere vuoti");
    return;
  } 
  if(hasWhiteSpace(data.nome) || hasWhiteSpace(data.cognome) || hasWhiteSpace(data.data_nascita) || hasWhiteSpace(data.targa) || hasWhiteSpace(data.carta_credito)){
    response.status(400).send("Non è possibile inserire spazi vuoti!");
    return;
  }
  if(data.carta_credito.length != 16){
    response.status(400).send("La carta di credito deve essere composta da esattamente 16 numeri!");
    return;
  }
  if(isNaN(data.carta_credito)){
    response.status(400).send("La carta di credito deve essere composta di soli numeri!");
    return;
  }

  database.collection('utenti').updateOne({ "_id" : ObjectID(request.params.id) },{ $set : data}, function(error, result) {
    if(error){
      console.log(error);
      response.send("Aggiornamento FALLITO");
    }
    response.send("Aggiornamento Effettuato");
  });
});

function hasWhiteSpace(s){
  return / /g.test(s);
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