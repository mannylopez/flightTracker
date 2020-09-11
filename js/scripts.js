mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-113.620, 36.711], // starting position [lng, lat]
  zoom: 5 // starting zoom
});

let lon_min = -125.859;
let lat_min = 30.313;
let lon_max = -101.513;
let lat_max = 42.470;

let url = `https://opensky-network.org/api/states/all?lamin=${lat_min}&lomin=${lon_min}&lamax=${lat_max}&lomax=${lon_max}`;

axios.get(url)
  .then((response) => {
    // Create an object by combining keys (hardcoded below) and values (from the API response) and push them into the flightsArray
    let flightsArray = [];
    let keys = ['icao24','callsign','origin_country','time_position','last_contact','long','lat','baro_altitude','on_ground','velocity','true_track','vertical_rate','sensors','geo_altitude','squawk','spi','position_source'];
    let values = response.data.states;

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

    // Add a marker for each flight
    for (let flight of flightsArray) {
      let marker = new mapboxgl.Marker()
        .setLngLat([flight.long, flight.lat])
        .addTo(map);
      }
  })
