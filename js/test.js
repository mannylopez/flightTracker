const axios = require('axios');

let milliseconds = Date.now()
let end = Math.floor((milliseconds) / 1000)
let start = end - (86400);

// console.log("start", start);
// console.log("end", end);


async function getAircraftRequest() {
  let icao24 = "a3500f";

  try {
    let result = await axios.get(`https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${start}&end=${end}`)
    console.log(result.data);
  } catch (error){
    console.log(error);
  }
}

// getAircraftRequest();

function convertFromEpoch(note, time) {
  let milli = time * 1000;
  let timeObject = new Date(milli);
  console.log(note, timeObject);
}

// convertFromEpoch("start", start)
// convertFromEpoch("end", end)

const getAirportName = async () => {
  const airportData = await getAirportData()

  console.log(airportData.data);

}

// getAirportName();



// Get flight vectors
// Returns an array of values
const [lon_min, lat_min, lon_max, lat_max] = [-107.414017,25.157405,-92.999954,37.013245]

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


let data = [
  {
    icao24: 'ab1210',
    callsign: 'N812PA  ',
    origin_country: 'United States',
    time_position: 1600234140,
    last_contact: 1600234140,
    long: -98.9188,
    lat: 28.1875,
    baro_altitude: 4343.4,
    on_ground: false,
    velocity: 140.6,
    true_track: 222.03,
    vertical_rate: -7.8,
    sensors: null,
    geo_altitude: 4648.2,
    squawk: null,
    spi: false,
    position_source: 0
  },
  {
    icao24: 'a7cb78',
    callsign: 'FDX1100 ',
    origin_country: 'United States',
    time_position: 1600234399,
    last_contact: 1600234399,
    long: -97.8235,
    lat: 32.4982,
    baro_altitude: 2240.28,
    on_ground: false,
    velocity: 145.55,
    true_track: 60.81,
    vertical_rate: -3.9,
    sensors: null,
    geo_altitude: 2331.72,
    squawk: null,
    spi: false,
    position_source: 0
  },
  {
    icao24: 'ac6724',
    callsign: 'LBQ640  ',
    origin_country: 'United States',
    time_position: 1600234399,
    last_contact: 1600234399,
    long: -95.965,
    lat: 31.4306,
    baro_altitude: 6705.6,
    on_ground: false,
    velocity: 179.72,
    true_track: 332.19,
    vertical_rate: 0,
    sensors: null,
    geo_altitude: 7109.46,
    squawk: null,
    spi: false,
    position_source: 0
  },
  {
    icao24: 'a18e0b',
    callsign: 'N2HL    ',
    origin_country: 'United States',
    time_position: 1600234399,
    last_contact: 1600234399,
    long: -105.3052,
    lat: 35.0619,
    baro_altitude: 12496.8,
    on_ground: false,
    velocity: 254.68,
    true_track: 84.78,
    vertical_rate: 0.98,
    sensors: null,
    geo_altitude: 13114.02,
    squawk: null,
    spi: false,
    position_source: 0
  },
  {
    icao24: 'a6aadf',
    callsign: 'FDX1215 ',
    origin_country: 'United States',
    time_position: 1600234399,
    last_contact: 1600234399,
    long: -93.9306,
    lat: 34.7668,
    baro_altitude: 11894.82,
    on_ground: false,
    velocity: 257.57,
    true_track: 92.98,
    vertical_rate: 0,
    sensors: null,
    geo_altitude: 12550.14,
    squawk: null,
    spi: false,
    position_source: 0
  }
]

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
console.log(JSON.stringify(geojson));

}

createGeoJSON();


// Test data

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

const center = [ -99.610376,31.295971 ];
// const elevation = 571.5 * 100;
const polygonRadius = 0.02;

let testPolygon = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              center[0] - polygonRadius,
              center[1] - polygonRadius
            ],
            [
              center[0] + polygonRadius,
              center[1] - polygonRadius
            ],
            [
              center[0] + polygonRadius,
              center[1] + polygonRadius
            ],
            [
              center[0] - polygonRadius,
              center[1] + polygonRadius
            ],
            [
              center[0] - polygonRadius,
              center[1] - polygonRadius
            ]
          ]
        ]
      }
    }
  ]
}





