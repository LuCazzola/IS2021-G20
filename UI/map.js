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
        data.forEach(parcheggio =>{
        var marker = {
            type: 'Feature',
            properties: {
                description: '<div class="row"><h1 id="nome_parcheggio">'+parcheggio.nome+'</h1><br><img src="IMG/star.svg" id="star" onclick="modifyStar()"></div><br><div class="row"><text>posti disponibili</text><text id="posti_disp">NAN</text></div><div class="row"><text>distanza</text><text id="distanza">NAN</text></div><div class="row"><text>prezzo</text><text id="prezzo">'+parcheggio.tariffa_oraria+'</text></div><div class="row"><text>Tempo di sosta</text><text id="tempo_sosta_value">2</text></div><input id="tempo_sosta" type="range" min="1" max="100" value="2" oninput="updateTempoSosta()"><input type="button" value="Prenota" id="prenota"><input type="hidden" id="key_parcheggio" value="'+parcheggio._id+'"></input>'
            },
            geometry: {
                type: 'Point',
                coordinates: [parcheggio.coord_E, parcheggio.coord_N]
            }
        };
        geojson.features.push(marker);
        map.getSource('custom').setData(geojson);

        map.addLayer({      //Elemento grafico
            'id': parcheggio.coord_E+"::"+parcheggio.coord_N,
            'type': 'circle',
            'source': 'custom',
            'paint': {
                'circle-color': '#FF0000',
                'circle-radius': 10,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#000000'
            }
        });

        map.on('click', parcheggio.coord_E+"::"+parcheggio.coord_N, (e) => {     //COMPORTAMENTO SULLA PRESSIONE

            map.flyTo({ center: e.features[0].geometry.coordinates });
           
            document.getElementById('parcheggioHighLight').innerHTML = e.features[0].properties.description;
            
            var highLight = document.getElementById('parcheggioHighLight');
            highLight.setAttribute('class','show');
        });
    })
});
