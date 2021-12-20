mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXp6b2xhIiwiYSI6ImNrd2t2eDdxYjFnYTkycG1kdXRjZ3VrNGMifQ.o3c2EpFW8PHSJesBS7vTrg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [11.133333, 46.066667], //Centro la mappa su Trento
    zoom: 14
});

//PARCHEGGI
var request = new XMLHttpRequest();

request.open('GET', 'http://localhost:49126/api/parcheggi', true);
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
            'circle-color': '#ff6347',
            'circle-radius': 10,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#000000'
        }
    });

    map.addSource('currPos', {
        'type': 'geojson',
        'data': {
                'type': 'FeatureCollection',
                'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [11.119344, 46.063561]
                    }
                }]
            }
        });

    map.addLayer({      //Elemento grafico
        'id': "Postition",
        'type': 'circle',
        'source': 'currPos',
        'paint': {
            'circle-color': '#005CC8',
            'circle-radius': 10,
            'circle-stroke-width': 1.5,
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

        open_park(feature.properties.title);
    });
});