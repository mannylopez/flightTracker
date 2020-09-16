const axios = require('axios');

// const callsign = 'SWA2251';
// const airportCode = 'KMDW';

// const getAirportData = async () => {
//   try {
//     return await axios.get(`https://opensky-network.org/api/routes?callsign=GTI3710`)
//   } catch (error) {
//     console.log(error)
//   }
// }

// const getAirportName = async () => {
//   const airportData = await getAirportData()

//   console.log(airportData.data);

// }

// // getAirportName();



// const [lon_min, lat_min, lon_max, lat_max] = [-91.617737,36.903646,-87.245178,42.591384]

// const url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;


async function getAllFlightVectors() {
  try {
    let allFlightVectors = await axios.get(url)
    console.log(allFlightVectors.data);
  } catch (error) {
    console.log(error)
  }
}


// getAllFlightVectors();

let milliseconds = Date.now()
let end = Math.floor((milliseconds) / 1000)
let start = end - (86400);

console.log("start", start);
console.log("end", end);


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

convertFromEpoch("start", start)
convertFromEpoch("end", end)
