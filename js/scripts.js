mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v8', // stylesheet location
  center: [-119.582723,37.7184766], // starting position [lng, lat]
  // pitch: 43, // pitch in degrees
  zoom: 3.8 // starting zoom
});

// const [lon_min, lat_min, lon_max, lat_max] = [-128.885422,24.173693,-65.428391,51.046143]
// const url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;

const url = `https://opensky-network.org/api/states/all`;

// Get flight vectors
// Returns an array of values
async function getAllFlightVectors() {
  try {
    return await axios.get(url)
  } catch (error) {
    console.log(error)
  }
}

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

  staticArray = flightsArray;
  return flightsArray;
}

async function createPointGeoJSON() {
  const flightVectorsArray = await createFlightVectorsArray();

  const geojson = {
    type: "FeatureCollection",
    features: flightVectorsArray.map(item => {
      return {
        id: item.icao24,
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

  return geojson;
}

async function createPolygonGeoJSON() {
  const polygonRadius = 0.02;

  const geojson = {
    type: "FeatureCollection",
    features: staticArray.map(item => {
      return {
        id: item.icao24,
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

  return geojson;
}

async function addMapLayer(){
  await map.on('load', async function() {

    let pointGeoJSON = await createPointGeoJSON();
    let polygonGeoJSON = await createPolygonGeoJSON();

    map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': pointGeoJSON
      },
      'layout': {
        'icon-image': 'airport-15',
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

    map.on('click', 'points', function(e) {
      let coordinates = e.features[0].geometry.coordinates.slice();

      let description = `<b>Flight ${e.features[0].properties.callsign}</b>
      </br>
      Velocity: ${Math.round(e.features[0].properties.velocity * 2.2369363)} mph
      </br>
      Altitude: ${Math.round(e.features[0].properties.geo_altitude)} meters
      </br>
      <a href="https://flightaware.com/live/flight/${e.features[0].properties.callsign}" target="_blank">View flight path on FlightAware</a>`

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({closeButton: false})
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
    });

    map.on('mouseenter', 'points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'points', () => {
      map.getCanvas().style.cursor = '';
    });
  })
}

document.getElementById('altitude').addEventListener('click', () => {
  map.setLayoutProperty('extrusion', 'visibility', 'visible')
  .setLayoutProperty('points', 'visibility', 'none')
  .setPitch(43);
})

document.getElementById('points').addEventListener('click', () => {
  map.setLayoutProperty('extrusion', 'visibility', 'none')
  .setLayoutProperty('points', 'visibility', 'visible')
  .setPitch(0);
})

addMapLayer();
