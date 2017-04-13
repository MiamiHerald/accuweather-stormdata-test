// Libraries
import $ from 'jquery';

// FOR DEVELOPMENT
// import 'leaflet/dist/leaflet-src';

// FOR PRODUCTION
import 'leaflet/dist/leaflet';

// Globals
var mapId             = 'mapid',
    initCoords        = [25.7617, -80.1918],
    initZoom          = 13,
    mapBoxAccessToken = 'pk.eyJ1IjoiY2hyaXNkdWJ5YSIsImEiOiJjaXRkZDNydnkwMDY4MnRtOTA2Y3hoaGh4In0.kzOT6chkFRIklbX08xiGew',
    mabBoxStyleURL    = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=' + mapBoxAccessToken,
    stormURL          = 'https://api.accuweather.com/tropical/v1/storms/2016/AL/14/positions?apikey=2ce96fe9da724185a27db1e6a3ecf580',
    geoJsonURL        = 'cone.geojson',
    map               = L.map(mapId).setView(initCoords, initZoom),
    polylineArray     = [];


function initMap() {
  // Add map tiles
  L.tileLayer(mabBoxStyleURL, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
  }).addTo(map);

  //
  $.getJSON(stormURL, function(data) {
    plotPoints(data);
  });

  // Initialize empty cone and add to map
  var cone = new L.geoJson();
  cone.addTo(map);

  // Load geoJson data into cone object
  $.getJSON(geoJsonURL, function(data) {
    $.each(data.features, function(key, data) {
      cone.addData(data);
    });
  });
}


function plotPoints(data) {
  // Render circle for each object in the Array,
  // also push the coordinates into polylineArray to create polyline
  $.each(data, function( index, value ) {
    var lat = value.Position.Latitude;
    var lon = value.Position.Longitude;

    var circle = L.circle([lat, lon], {
      color: '#D81E5B',
      fillColor: '#FFFD98',
      fillOpacity: 0.5,
      radius: 20000
    }).addTo(map);

    circle.bindPopup(value.Storm.Name + ': ' + value.Status);

    polylineArray.push([lat, lon]);
  });

  // Render polyline
  var polyline = L.polyline(polylineArray, {
    color: '#59C9A5',
    smoothFactor: 1.0
  }).addTo(map);
  polyline.bringToBack();

  map.fitBounds(polyline.getBounds());
}

$(function() {
  initMap();
});
