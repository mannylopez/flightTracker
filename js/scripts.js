mapboxgl.accessToken = 'pk.eyJ1IjoibWFubnkiLCJhIjoiY2tld2Qxa3hsMDMxaDJxbDZha3k1d3d1NiJ9.1Tab3NmvKhVjSTe_Fdu7VQ';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [2.154007, 41.390205], // starting position [lng, lat]
  zoom: 1 // starting zoom
});
