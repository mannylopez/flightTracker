### September 10, 2020
#### Goals
- [x] Create an array of objects by combining the keys and values from [Opensky network REST response](https://opensky-network.org/api/states/all?lamin=30.038&lomin=-125.974&lamax=52.214&lomax=-68.748)
- [x] Place markers on map for each airplane

#### Log
##### :white_check_mark: Create an array of objects by combining the keys and values from [Opensky network REST response](https://opensky-network.org/api/states/all?lamin=30.038&lomin=-125.974&lamax=52.214&lomax=-68.748)
Right now, the the flight data comes in through the `states` array in the response. I need to couple that the array of keys:

```js

let keys = ['icao24','callsign','origin_country','time_position','last_contact','long','lat','baro_altitude','on_ground','velocity','true_track','vertical_rate','sensors','geo_altitude','squawk','spi','position_source'];

```
with the values in the REST endpoint response (shortened here):
```JSON
{
  "time": 1599794990,
  "states": [
      [
          "aa56d8",
          "UAL2157 ",
          "United States",
          1599794989,
          1599794989,
          -114.6796,
          33.8198,
          10972.8,
          false,
          206.62,
          277.73,
          0,
          null,
          11506.2,
          "1610",
          false,
          0
      ],
      [
          "a7b07c",
          "FDX1314 ",
          "United States",
          1599794989,
          1599794989,
          -74.1831,
          40.661,
          495.3,
          false,
          91.69,
          177.11,
          14.63,
          null,
          533.4,
          "1705",
          false,
          0
      ]
    ]
}
```
by using a for loop:
```js
let flightsArray = [];
let values = response.data.states;

for (let y = 0; y < values.length; y++) {
  let state = values[y];
  let obj = {};
  for (let x = 0; x < state.length; x++) {
    obj[keys[x]] = state[x];
  }
  flightsArray.push(obj)
}
```
Result:
```js
[
  {
    icao24: 'aa56d8',
    callsign: 'UAL2157 ',
    origin_country: 'United States',
    time_position: 1599796979,
    last_contact: 1599796979,
    long: -117.7826,
    lat: 33.8106,
    baro_altitude: 1173.48,
    on_ground: false,
    velocity: 108.59,
    true_track: 213.01,
    vertical_rate: -5.53,
    sensors: null,
    geo_altitude: 1219.2,
    squawk: '2627',
    spi: false,
    position_source: 0
  },
  {
    icao24: 'a3f2ae',
    callsign: 'N35325  ',
    origin_country: 'United States',
    time_position: 1599796979,
    last_contact: 1599796979,
    long: -111.9828,
    lat: 33.4935,
    baro_altitude: 1493.52,
    on_ground: false,
    velocity: 56.19,
    true_track: 176.33,
    vertical_rate: 0,
    sensors: null,
    geo_altitude: 1554.48,
    squawk: '4376',
    spi: false,
    position_source: 0
  }
```
Success! :tada:

##### :white_check_mark: Place markers on map for each airplane
I can now take the array of objects and iterate over each array and add a marker to the map
```javascript
// Add a marker for each flight
for (let flight of flightsArray) {
  let marker = new mapboxgl.Marker()
    .setLngLat([flight.long, flight.lat])
    .addTo(map);
  }
```
