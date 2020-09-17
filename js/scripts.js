mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v8', // stylesheet location
  center: [-99.610376,31.295971], // starting position [lng, lat]
  pitch: 60, // pitch in degrees
  zoom: 5.4 // starting zoom
});

// Get flight vectors
// Returns an array of values
const [lon_min, lat_min, lon_max, lat_max] = [-128.885422,24.173693,-65.428391,51.046143]

const url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;


async function getAllFlightVectors() {
  try {
    return await axios.get(url)
  } catch (error) {
    console.log(error)
  }
}

// icao24: 0,
// callsign: 1,
// long: 5,
// lat: 6,
// velocity: 9,
// true_track: 10,
// geo_altitude: 13

let staticArray = [];

// Gives keys to values
// Returns an array of objects
async function createFlightVectorsArray() {
  const allFlightVectors = await getAllFlightVectors();

  // Create an object by combining keys (hardcoded in keys array below) and values (from the API response) and push them into the flightsArray
  let flightsArray = [];
  let keys = ['icao24','callsign','origin_country','time_position','last_contact','long','lat','baro_altitude','on_ground','velocity','true_track','vertical_rate','sensors','geo_altitude','squawk','spi','position_source'];

  let values = allFlightVectors.data.states;

  for (let y = 0; y < values.length; y++) {
    let state = values[y];
    let obj = {};
    for (let x = 0; x < state.length; x++) {
      obj[keys[x]] = state[x];
    }
    flightsArray.push(obj)
  }
  // console.log(flightsArray);
  console.log(flightsArray[0]);
  staticArray = flightsArray;
  return flightsArray;
}

async function createPointGeoJSON() {
  const flightVectorsArray = await createFlightVectorsArray();

  const geojson = {
    type: "FeatureCollection",
    features: flightVectorsArray.map(item => {
      return {
        icao24: item.icao24,
        type: "Feature",
        properties: {
          icao24: item.icao24,
          callsign: item.callsign,
          velocity: item.velocity,
          true_track: item.true_track,
          geo_altitude: item.geo_altitude
        },
        geometry: {
          type: "Point",
          coordinates: [item.long, item.lat]
        }
      };
    })
  };

console.log(geojson);
// console.log(JSON.stringify(geojson));

return geojson;
}

async function createPolygonGeoJSON() {
  const polygonRadius = 0.02;
  const flightVectorsArray = staticArray;

  const geojson = {
    type: "FeatureCollection",
    features: flightVectorsArray.map(item => {
      return {
        icao24: item.icao24,
        type: "Feature",
        properties: {
          icao24: item.icao24,
          callsign: item.callsign,
          velocity: item.velocity,
          true_track: item.true_track,
          geo_altitude: item.geo_altitude * 10
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [
                item.long - polygonRadius,
                item.lat - polygonRadius
              ],
              [
                item.long + polygonRadius,
                item.lat - polygonRadius
              ],
              [
                item.long + polygonRadius,
                item.lat + polygonRadius
              ],
              [
                item.long - polygonRadius,
                item.lat + polygonRadius
              ],
              [
                item.long - polygonRadius,
                item.lat - polygonRadius
              ]
            ]
          ]
        }
      };
    })
  };

// console.log(geojson);
// console.log(JSON.stringify(geojson));

return geojson;
}



async function addMapLayer(){
  let pointGeoJSON = await createPointGeoJSON();
  console.log(pointGeoJSON);
  let polygonGeoJSON = await createPolygonGeoJSON();
  console.log(polygonGeoJSON);

  map.on('load', function() {
    // map.addSource('points', {
    //   'type': 'geojson',
    //   'data': pointGeoJSON
    // })

    // map.addSource('altitudes', {
    //   'type': 'geojson',
    //   'data': polygonGeoJSON
    // })

    map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': pointGeoJSON
      },
      'layout': {
        'icon-image': 'airport-15',
        // 'icon-color': '#f5b7b1',
        'icon-rotate': ['get', 'true_track'],
        'icon-allow-overlap': true
      }
    })


    map.addLayer({
      'id': 'extrusion',
      'type': 'fill-extrusion',
      'source': {
        'type': 'geojson',
        'data': polygonGeoJSON
      },
      'paint': {
        'fill-extrusion-color': '#78d2f7',
        'fill-extrusion-height': ['get', 'geo_altitude'],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.8
      }
    })

    map.setLayoutProperty('extrusion', 'visibility', 'none')

  })
}


addMapLayer();

document.getElementById('altitude').addEventListener('click', () => {
  console.log('clicked altitude');
  map.setLayoutProperty('extrusion', 'visibility', 'visible')
  map.setLayoutProperty('points', 'visibility', 'none')
})


document.getElementById('points').addEventListener('click', () => {
  console.log('clicked points');
  map.setLayoutProperty('extrusion', 'visibility', 'none')
  map.setLayoutProperty('points', 'visibility', 'visible')

})




















