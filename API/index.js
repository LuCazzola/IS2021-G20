var Express = require("express");
var app = Express();

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
                url: 'http://localhost:49126',
            },
        },
        servers: [
            {
                url: 'http://localhost:49126',
                description: 'Development server',
            },
        ],
    },
    apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

var MongoClient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectId;
var CONNECTION_STRING = "mongodb+srv://G20:G19@cluster0.ditxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var DB = "smartparking";
var database;

var bodyParser = require("body-parser");
var cors = require("cors");

app.use('/Api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//DEFAULT DATABASE CONNECTION
app.listen(49126, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, 
    useUnifiedTopology: true }, (error, client) => {
      if(error){
        console.log("CONNECTION FAILED\n" + error);
      }
      else{
        database = client.db(DB);
        console.log("CONNESSIONE RIUSCITA");
      }
    })
});



/**
 * @swagger
 * /api/parcheggi:
 *   get:
 *     tags:
 *       - Parcheggi
 *     summary: Restituisce una lista di parcheggi.
 *     description: Restituisce coordinate cartesiane ed ID di tutti i parcheggi, al fine di generare la mappa.
 *     responses:
 *       200:
 *         description: Tutte le coordinate + _ID dei parcheggi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parcheggi:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61acba7f736680ca6f6e1f52      
 *                       coord_N:
 *                          type: float
 *                          description: Latitudine del parcheggio
 *                          example: 46.06646
 *                       coord_E:
 *                          type: float
 *                          description: Longitudine del parcheggio
 *                          example: 11.11515
 */
app.get('/api/parcheggi', (request, response) => {

  var select = {  //Seleziono solo i campi utili a generare la mappa
    _id : 1,
    coord_N : 1,
    coord_E : 1
  }
  
  database.collection("parcheggi").find({}).project(select).toArray((error, parcheggi) => {
    if(error){
      console.log(error);
    }
    response.send({parcheggi});
  })
});



/**
 * @swagger
 * /api/parcheggi/filtri?nome&tariffa&preferiti: 
 *   get:
 *     tags:
 *       - Parcheggi
 *     summary: Restituisce una lista di parcheggi selezionadoli attraverso dei filtri.
 *     description: Restituisce una lista di parcheggi dal server.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *             type: string
 *         allowReserved: true
 *         default: ''
 *         description: Sottostringa da cercare nel nome del parcheggio
 *       - in: query
 *         name: tariffa
 *         schema:
 *             type: float
 *         allowReserved: true
 *         default: 2.0
 *         description: Tariffa oraria massima da cercare
 *       - in: query
 *         name: preferiti
 *         schema:
 *             type: boolean
 *         allowReserved: true
 *         default: false
 *         description: Indica se il filtro preferiti è attivo/disattivo
 *     responses:
 *       200:
 *         description: Una lista di parcheggi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parcheggi:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
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
app.get('/api/parcheggi/filtri', (request, response) => {
  var data = {
    "nome" : request.query['nome'],
    "tariffa" : parseFloat(request.query['tariffa']),
    "preferiti" : (request.query['preferiti'] == "true")
  }

  var query;

  if(data.preferiti){   //considero solo i parcheggi preferiti
    query = {
      'nome' : {$regex: ".*" + data.nome + ".*"},
      'tariffa_oraria' : { $lte: data.tariffa},
      'is_preferito' : data.preferiti
    }
  }else{                //considero preferiti e NON preferiti
    query = {
      'nome' : {$regex: ".*" + data.nome + ".*"},
      'tariffa_oraria' : { $lte: data.tariffa},
    }
  }

  database.collection("parcheggi").find(query).toArray((error, parcheggi) => {
    if(error){
      console.log(error);
    }
    response.send({parcheggi});
  })
});


//parcheggio singolo
/**
 * @swagger
 * /api/parcheggi/{id}:
 *   get:
 *     tags:
 *       - Parcheggi
 *     summary: Restituisce un singolo parcheggio.
 *     description: Restituisce i dati del parcheggio con id specificato dal server.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         default: '61acba7f736680ca6f6e1f52'
 *         description: id del parcheggio
 *     responses:
 *       200:
 *         description: Un oggetto parcheggio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parcheggio:
 *                   type: object
 *                   properties:
 *                       _id:
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
 *     400:
 *       description: Formato _ID non valido
 *     404:
 *       description: Parcheggio non trovato
 */
app.get('/api/parcheggi/:id', (request, response) => {

  var id;

  try{
    id = ObjectID(request.params.id)
  }catch (error){
    response.status(400).send("Formato ID non valido");
    return;
  }

  database.collection('parcheggi').findOne({ "_id" : id })
  .then(parcheggio => {
    if(parcheggio != null){
      response.send({parcheggio});
    }
    else{
      response.status(404).send();
    }
  })
  .catch(err => console.log(err));
});


//Aggiornamento preferiti parcheggio
/**
 * @swagger
 * /api/parcheggi/preferiti/{id}/{update}:
 *   post:
 *     tags:
 *       - Parcheggi
 *     summary: Aggiorna un parcheggio come preferito.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acba7f736680ca6f6e1f52
 *         description: id del parcheggio
 *       - in: path
 *         name: update
 *         schema:
 *             type: boolean
 *         required: true
 *         default: false
 *         description: Nuovo stato preferenza del parcehggio
 *     responses:
 *       200:
 *         description: successful executed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Aggiornamento effettuato, Nuovo stato -> true/false
 *       404:
 *         description: Parcheggio non trovato
 *       400:
 *         description: Formato _ID non valido
*/
app.post('/api/parcheggi/preferiti/:id/:update', (request, response) => {
 
  var data = {
    is_preferito : (request.params.update == "true")
  }

  var id;
  try{
    id = ObjectID(request.params.id)
  }catch (error){
    response.status(400).send("Formato ID non valido");
    return;
  }

  database.collection('parcheggi').updateOne({ "_id" : id },{ $set : data})
  .then(result => {
    if(result.matchedCount > 0){
      response.send("Aggiornamento effettuato\nNuovo stato -> "+request.params.update);
    }
    else{
      response.status(404).send();
    }
  })
  .catch(err => console.log(err));

});


//Dati di un singolo utente
/**
 * @swagger
 * /api/utenti/{id}:
 *   get:
 *     tags:
 *       - Utenti
 *     summary: Restituisce i dati di un singolo Utente.
 *     description: Restituisce i dati di un singolo utente dal server.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acb903736680ca6f6e1f3f
 *         description: _ID utente.
 *     responses:
 *       200:
 *         description: dati di un singolo utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utente:
 *                   type: object
 *                   properties:
 *                       _id:
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
 *       404:
 *         description: Utente non trovato
 *       400:
 *         description: Formato _ID non valido              
 */
app.get('/api/utenti/:id', (request, response) => {
  var id;
  try{
    id = ObjectID(request.params.id);
  }catch (error){
    response.status(400).send("Formato ID non valido");
    return;
  }

  database.collection('utenti').findOne({ "_id" : id })
  .then(utente => {
    if(utente != null){
      response.send({utente});
    }
    else{
      response.status(404).send();
    }
  })
  .catch(err => console.log(err));
});


//prendo tutte le prenotazioni di un utente specifico
/**
 * @swagger
 * /api/prenotazioni/{id}:
 *   get:
 *     tags:
 *       - Prenotazioni
 *     summary: Restituisce una lista di prenotazioni di un utente specifico.
 *     description: Restituisce una lista di prenotazioni dal server.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acb903736680ca6f6e1f3f
 *         description: ID utente.
 *     responses:
 *       200:
 *         description: Tutte le prenotazioni di un utente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prenotazioni:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: La chiave assegnata da MongoDB.
 *                         example: 61b4ec5ac421271a6aa2d8e0
 *                       utente_ID:
 *                         type: string
 *                         description: ID utente.
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
 *       400:
 *         description: formato _ID errato       
 */
app.get('/api/prenotazioni/:id', (request, response) => {
  var id;
  try{
    id = ObjectID(request.params.id);
  }catch (error){
    response.status(400).send();
    return;
  }

  database.collection("prenotazioni").find({ 'utente_ID' : request.params.id }).toArray((error, prenotazioni) => {
    if(error){
      console.log(error);
    }
    response.send({prenotazioni});
  });
});





//Nuova prenotazione
/**
 * @swagger
 * /api/prenotazioni/{user_id}/{park_id}:
 *   post:
 *     tags:
 *       - Prenotazioni
 *     summary: Creo una nuova prenotazione.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acb903736680ca6f6e1f3f
 *         description: ID utente.
 *       - in: path
 *         name: park_id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acba7f736680ca6f6e1f52
 *         description: ID parcheggio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 ore:
 *                   type: integer
 *                   description: ore di sosta
 *                   example: 2
 *                 nome_parcheggio:
 *                   type: string
 *                   description: nome del parcheggio
 *                   example: Parcheggio Sanseverino
 *     responses:
 *       200:
 *         description: successful executed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Prenotazione aggiunta con successo! Puoi visualizzarla alla sezione 'Prenotazioni'
 *       400:
 *         description: Formato _ID non valido
*/
app.post('/api/prenotazioni/:user_id/:park_id', (request, response) => {
  try{
    user_id = ObjectID(request.params.user_id);
    park_id = ObjectID(request.params.park_id);
  }catch (error){
    response.status(400).send();
    return;
  }

  var today = new Date()
  var now = today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes();

  today.addHours(request.body['ore']);
  var later = today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes();
  var costo = (request.body['ore']*request.body['tariffa']).toFixed(2);
  
  var data = {
    "utente_ID" : request.params.user_id,
    "id_parcheggio" : request.params.park_id,
    "nome_parcheggio" : request.body['nome_parcheggio'], 
    "inizio" : now,
    "fine" : later,
    "costo" : costo
  };

  database.collection("prenotazioni").insertOne(data)
    .then(result => {
      response.send("Prenotazione aggiunta con successo!\nPuoi visualizzarla alla sezione 'Prenotazioni'");
    })
    .catch(err => console.log(err));
});



//elimino la prenotazione dell'utente
/**
 * @swagger
 * /api/prenotazioni/{id_pren}:
 *   delete:
 *     tags:
 *       - Prenotazioni
 *     summary: Elimino la prenotazione selezionata.
 *     parameters:
 *       - in: path
 *         name: id_pren
 *         schema:
 *             type: string
 *         required: true
 *         default: 61b4eca2c421271a6aa2d8e1
 *         description: _ID della prenotazione
 *     responses:
 *       200:
 *         description: Prenotazione eliminata
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Prenotazione eliminata con successo!
 *       404:
 *         description: Prenotazione non trovata
*/
app.delete('/api/prenotazioni/:id_pren', (request, response) => {
  database.collection("prenotazioni").deleteOne({ "_id" : ObjectID(request.params.id_pren) })
    .then(result => {
      if(result.deletedCount > 0){
        response.send("Prenotazione eliminata con successo!");
      }
      else{
        response.status(404).send();
      }
    })
});




//Modifica specifico utente
/**
 * @swagger
 * /api/utenti/{id}:
 *   post:
 *     tags:
 *       - Utenti
 *     summary: Modifico uno specifico utente.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *         required: true
 *         default: 61acb903736680ca6f6e1f3f
 *         description: ID utente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: Luca
 *               cognome:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: Cazzola
 *               email:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: LC@gmail.com
 *               data_nascita:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: 2001-07-09
 *               targa:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: AA000AA
 *               carta_credito:
 *                  type: string
 *                  description: Chiave assegnata da MongoDB.
 *                  example: 1234123412341234
 *     responses:
 *       200:
 *         description: successful executed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Aggiornamento effettuato
 *       400:
 *         description: Campi non validi
 *       404:
 *         description: Utente non trovato
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

  var id;

  try{
    id = ObjectID(request.params.id);
  }catch (error){
    response.status(400).send("Formato ID non valido");
    return;
  }

  database.collection('utenti').updateOne({ "_id" : id },{ $set : data})
  .then(result => {
    if(result.matchedCount > 0){
      response.send("Aggiornamento Effettuato");
    }
    else{
      response.status(404).send();
    }
  })
  .catch(err => console.log(err));

});

function hasWhiteSpace(s){
  return / /g.test(s);
}

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

