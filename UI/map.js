mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXp6b2xhIiwiYSI6ImNrd2t2eDdxYjFnYTkycG1kdXRjZ3VrNGMifQ.o3c2EpFW8PHSJesBS7vTrg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [11.133333, 46.066667], //Centro la mappa su Trento
    zoom: 14
});

//PARCHEGGI
var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:5000/api/parcheggi', true);
var data;
request.onload = function () {
    data = JSON.parse(this.response);
}
request.send();

var geojson = {
    "type": "FeatureCollection",
    "features": []
};

//Caricamento punti di interesse dall'archivio
map.on('load', () => {
    map.addSource('custom', {
        "type": "geojson",
        "data": geojson
    });
    
    // Inserimento dinamico dei marker sulla mappa
    data.forEach(parcheggio =>
    {
        var currID = parcheggio._id;

        var marker = {
            type: 'Feature',
            properties: {
                title : currID
            },
            geometry: {
                type: 'Point',
                coordinates: [parcheggio.coord_E, parcheggio.coord_N]
            }
        };
        geojson.features.push(marker);
    });
    map.addLayer({      //Elemento grafico
        'id': "Markers",
        'type': 'circle',
        'source': 'custom',
        'paint': {
            'circle-color': '#FF0000',
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
        }
    });
    map.getSource('custom').setData(geojson);


    //COMPORTAMENTO SULLA PRESSIONE
    map.on('click', (event) => {     
        const features = map.queryRenderedFeatures(event.point, {
            layers: ['Markers']
        });
        if (!features.length) {
            return;
        }
        const feature = features[0];

        map.flyTo({ center: feature.geometry.coordinates });

        var highLight = document.getElementById('parcheggioHighLight');

        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:5000/api/parcheggi/parcheggio/'+feature.properties.title, true);  
        console.log(feature.properties.title);
        
        request.onload = function () {
            park = JSON.parse(this.response);

            if (request.status >= 200 && request.status < 400){

                var star_extension = "";
                if(!park.is_preferito){
                    star_extension = "-no";
                }
                var onclickText = " modifyParkStar('"+park._id+"');";

                highLight.innerHTML = '<div class="row"><h1 id="nome_parcheggio">'+park.nome+'</h1><br><img src="IMG/star'+star_extension+'.svg" id="star_'+park._id+'" onclick="'+onclickText+'"></div><br><div class="row"><text>posti disponibili</text><text id="posti_disp">NAN</text></div><div class="row"><text>distanza</text><text id="distanza">NAN</text></div><div class="row"><text>prezzo</text><text id="prezzo">'+park.tariffa_oraria+'</text></div><div class="row"><text>Tempo di sosta</text><text id="tempo_sosta_value">2</text></div><input id="tempo_sosta" type="range" min="1" max="100" value="2" oninput="updateTempoSosta()"><input type="button" value="Prenota" id="prenota"><input type="hidden" id="key_parcheggio" value="'+park._id+'"></input>' 
                highLight.setAttribute('class','show');
            }
            else {
                alert(this.response);
            }
        }
        request.send();
    });
});