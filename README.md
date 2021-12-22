# APIs progetto Smart-Parking

Questa repository contitne il progetto <b>Smart-Parking</b>, sviluppato dal gruppo G20 del corso di Ingegneria del Software AA 2021-2022.

Le APIs qui definite raccolgono l'insieme delle procedure che permettono di fornire i dati necessari al funzionamento dell'applicazione Smart Parking.
Per soddifare queste richieste sono stati importati i seguenti moduli:
* Body-parser
* Cors
* Express
* MongoDB
* Swagger-jsdoc
* Swagger-ui-express
* Supertest
* Tape

Segue la documentazione generata attraverso JSDoc che descrive in modo approfondito ogni metodo definito nelle diverse API. <BR>
Per consultare la documentazione è necessario avere installato il Runtime System <b>Node.js</b>, dopodiché:
<BR> Scaricare la repository, aprire il terminale e accedere alla cartella "./SERVER", infine digitare il comando "npm start". 
<BR> Successivamente cliccare sul seguente URL:
<br><p align="center"><a href="http://localhost:49126/api-docs/">http://localhost:49126/api-docs/</a></p>


<BR><BR><BR>
  Segue un esempio dell'homepage dell'applicazione <b>SmartParking</b>:
<p align="center">
  <img src="https://github.com/LuCazzola/IS2021-G20/blob/main/UI/IMG/Front_End_SmartParking.png" alt="Immagine Front End">
</p>
<BR><BR><BR>

Nella cartella "./TEST" è stato implementato uno script per eseguire il test di tre APIs:
* Delete che permette di eliminare una prenotazione specifica
* Post che aggiorna i dati di un utente
* Get che restituisce un singolo parcheggio
  
Per eseguire il test bisogna aprire il terminale e accedere alla cartella "./SERVER" e digitare il comando "npm test".
  
NB: Poiché la Delete si basa sul campo _id della prenotazione (che è univoco) nel caso in cui si vogliano fare altri test basta modificare la variabile “pren_id_test._N” nell’url di chiamata alla API.
<BR><BR>

La licenza utilizzata per questo progetto è <b>MIT License</b>, prima dell'utilizzo del software consultare l'apposita documentazione.
<BR><BR>
## Contributors:

This study has been designed, developed, and reported by the following developers:

* <b>Dennis Cattoni</b> - Università degli studi di Trento (Unitn), Trento - Italy

* <b>Sergio Brodesco</b> - Università degli studi di Trento (Unitn), Trento - Italy

* <b>Luca Cazzola</b> - Università degli studi di Trento (Unitn), Trento - Italy

For any information, feel free to contact us by writing an email.
