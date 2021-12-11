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
app.get('/api/parcheggi', (request, response) => {
  database.collection("parcheggi").find({}).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});

//parcheggi con filtri
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

//Dati di un singolo utente
app.get('/api/utenti/:id', (request, response) => {
  database.collection('utenti').findOne({ "_id" : ObjectID(request.params.id) }, function (error, result){
    if(error){
      console.log(error);
    }
    response.send(result);
  });
});

//prendo tutte le prenotazioni di un utente specifico
app.get('/api/prenotazioni/:id', (request, response) => {
  database.collection("prenotazioni").find({ 'utente_ID' : request.params.id }).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    console.log(result);
    response.send(result);
  })
});

//Nuova prenotazione
app.post('/api/prenotazioni/:id', (request, response) => {

  var today = new Date()
  var now = today.getHours();
  today.addHours(request.body['ore']);
  var later = today.getHours();
  
  var data = {
    "utente_ID" : request.body['id'],
    "id_parcheggio" : request.body['id_parcheggio'],
    "nome_parcheggio" : request.body['nome_parcheggio'], 
    "ore" : now, 
    "giorno" : request.body['giorno'],
    "ora_inizio" : today.getHours(),
    "ora_fine" : later,
    "costo" : request.body['costo'],
  };

  database.collection("prenotazioni").insertOne(data, function(error, result){ 
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});

//elimino la prenotazione dell'utente
app.delete('/api/prenotazioni/:id_pren', (request, response) => {
  database.collection("prenotazioni").remove({ "_id" : ObjectID(request.params.id_pren) }).toArray((error, result) => {
    if(error){
      console.log(error);
    }
    response.send(result);
  })
});

//Modifica specifico utente
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