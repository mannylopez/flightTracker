let obj = {
  "time": 1599796980,
  "states": [
    [
      "aa56d8",
      "UAL2157 ",
      "United States",
      1599796979,
      1599796979,
      -117.7826,
      33.8106,
      1173.48,
      false,
      108.59,
      213.01,
      -5.53,
      null,
      1219.2,
      "2627",
      false,
      0
    ],
    [
      "a3f2ae",
      "N35325  ",
      "United States",
      1599796979,
      1599796979,
      -111.9828,
      33.4935,
      1493.52,
      false,
      56.19,
      176.33,
      0,
      null,
      1554.48,
      "4376",
      false,
      0
    ],
    [
      "a7b07c",
      "FDX1314 ",
      "United States",
      1599796979,
      1599796979,
      -79.0717,
      39.2826,
      11582.4,
      false,
      242.21,
      245.67,
      0,
      null,
      12283.44,
      "6037",
      false,
      0
    ],
    [
      "ac4963",
      "DAL869  ",
      "United States",
      1599796980,
      1599796980,
      -96.8121,
      44.3693,
      11887.2,
      false,
      257.23,
      77.41,
      0,
      null,
      12435.84,
      "6013",
      false,
      0
    ]
  ]
}

let keys = ['icao24','callsign','origin_country','time_position','last_contact','long','lat','baro_altitude','on_ground','velocity','true_track','vertical_rate','sensors','geo_altitude','squawk','spi','position_source'];

let values = obj.states;
let finalArray = [];
for (let y = 0; y < values.length; y++) {
  let array = values[y];
  let obj = {};
  for (let x = 0; x < array.length; x++) {
    obj[keys[x]] = array[x];
  }
  finalArray.push(obj)

}
console.log(finalArray);
console.log("Fini");




