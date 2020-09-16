mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v8', // stylesheet location
  center: [-92.917213,38.243843], // starting position [lng, lat]
  zoom: 4 // starting zoom
});

const [lon_min, lat_min, lon_max, lat_max] = [-127.123489,24.139861,-58.744583,50.017005]

const url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;

async function getAllFlightVectors() {
  try {
    return await axios.get(url)
  } catch (error) {
    console.log(error)
  }
}

async function createFlightVectorsObject() {
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
  console.log(flightsArray);
  console.log(flightsArray[0]);
  return flightsArray;
}

async function addFlightMarkerToMap() {
  const flightVectorsObject = await createFlightVectorsObject();

  for (let flight of flightVectorsObject) {
    let el = document.createElement('div');
    el.className = 'plane';
    let marker = new mapboxgl.Marker(el)
      .setLngLat([flight.long, flight.lat])
      .setRotation(flight.true_track)
      .setPopup(new mapboxgl.Popup().setHTML(`Callsign: ${flight.callsign}
        </br>
        Lon/lat: ${flight.long}, ${flight.lat}
        </br>
        icao24: ${flight.icao24}`))
      .addTo(map);


    marker.getElement().addEventListener("click", () => {
      console.log(flight);
    })
  }
}

addFlightMarkerToMap();

// async function main(){
//   await addFlightMarkerToMap();
// }

// main().catch(console.log);


// axios.get(url)
//   .then((response) => {
//     // Create an object by combining keys (hardcoded below) and values (from the API response) and push them into the flightsArray
//     let flightsArray = [];
//     let keys = ['icao24','callsign','origin_country','time_position','last_contact','long','lat','baro_altitude','on_ground','velocity','true_track','vertical_rate','sensors','geo_altitude','squawk','spi','position_source'];
//     let values = response.data.states;

//     for (let y = 0; y < values.length; y++) {
//       let state = values[y];
//       let obj = {};
//       for (let x = 0; x < state.length; x++) {
//         obj[keys[x]] = state[x];
//       }
//       flightsArray.push(obj)
//     }

//     console.log(flightsArray);
//     console.log(flightsArray[0]);

//     // Add a marker for each flight
//     for (let flight of flightsArray) {
//       let el = document.createElement('div');
//       el.className = 'plane';
//       let marker = new mapboxgl.Marker(el)
//         .setLngLat([flight.long, flight.lat])
//         .setRotation(flight.true_track)
//         .setPopup(new mapboxgl.Popup().setHTML(`Callsign: ${flight.callsign} </br> Lon/lat: ${flight.long}, ${flight.lat} </br> icao24: ${flight.icao24}`))
//         .addTo(map);
//       }
//   })
