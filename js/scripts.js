mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v8', // stylesheet location
  center: [-100.198231,31.276717], // starting position [lng, lat]
  pitch: 40, // pitch in degrees
  zoom: 5.5 // starting zoom
});

// Get flight vectors
// Returns an array of values
const [lon_min, lat_min, lon_max, lat_max] = [-129.664764,24.300482,-58.824921,51.298637]

const url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;


async function getAllFlightVectors() {
  try {
    return await axios.get(url)
  } catch (error) {
    console.log(error)
  }
}

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
  // console.log(flightsArray[0]);
  return flightsArray;
}


let testGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "icao24": "acdc05",
      "type": "Feature",
      "properties": {
        "icao24": "acdc05",
        "callsign": "N928BK  ",
        "origin_country": "United States",
        "time_position": 1600236399,
        "last_contact": 1600236399,
        "baro_altitude": 7627.62,
        "on_ground": false,
        "velocity": 210.79,
        "true_track": 259.6,
        "vertical_rate": 10.73,
        "sensors": null,
        "geo_altitude": 7978.14,
        "squawk": null,
        "spi": false,
        "position_source": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -97.9956,
          32.9343
        ]
      }
    },
    {
      "icao24": "ac9f51",
      "type": "Feature",
      "properties": {
        "icao24": "ac9f51",
        "callsign": "N912NM  ",
        "origin_country": "United States",
        "time_position": 1600236399,
        "last_contact": 1600236399,
        "baro_altitude": 5090.16,
        "on_ground": false,
        "velocity": 132.25,
        "true_track": 141.79,
        "vertical_rate": 0,
        "sensors": null,
        "geo_altitude": 5410.2,
        "squawk": null,
        "spi": false,
        "position_source": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -107.4055,
          35.8725
        ]
      }
    },
    {
      "icao24": "a4f5c7",
      "type": "Feature",
      "properties": {
        "icao24": "a4f5c7",
        "callsign": "N419CF  ",
        "origin_country": "United States",
        "time_position": 1600236371,
        "last_contact": 1600236375,
        "baro_altitude": 502.92,
        "on_ground": false,
        "velocity": 67.91,
        "true_track": 180.43,
        "vertical_rate": 0,
        "sensors": null,
        "geo_altitude": 533.4,
        "squawk": null,
        "spi": false,
        "position_source": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -97.3334,
          32.4355
        ]
      }
    }
  ]
}

async function createGeoJSON() {
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
          origin_country: item.origin_country,
          time_position: item.time_position,
          last_contact: item.last_contact,
          baro_altitude: item.baro_altitude,
          on_ground: item.on_ground,
          velocity: item.velocity,
          true_track: item.true_track,
          vertical_rate: item.vertical_rate,
          sensors: item.sensors,
          geo_altitude: item.geo_altitude,
          squawk: item.squawk,
          spi: item.spi,
          position_source: item.position_source
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

// createGeoJSON();

async function addMapLayer(){
  let flightGeoJSON = await createGeoJSON();

  map.on('load', function() {
    map.addSource('points', {
      'type': 'geojson',
      'data': flightGeoJSON
    })

    map.addLayer({
      'id': 'points',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 6,
        'circle-color': '#B42222'
      }
    })
  })
}


addMapLayer();























