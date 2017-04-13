import $ from 'jquery';
// FOR DEVELOPMENT
import 'leaflet/dist/leaflet-src';

// FOR PRODUCTION
// import 'leaflet/dist/leaflet';

var map = L.map('mapid').setView([25.7617, -80.1918], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiY2hyaXNkdWJ5YSIsImEiOiJjaXRkZDNydnkwMDY4MnRtOTA2Y3hoaGh4In0.kzOT6chkFRIklbX08xiGew'
}).addTo(map);

$.getJSON( "https://api.accuweather.com/tropical/v1/storms/2016/AL/14/positions?apikey=2ce96fe9da724185a27db1e6a3ecf580", function( data ) {
  plotPoints(data);
});

var cone = new L.geoJson();
cone.addTo(map);

$.ajax({
  dataType: "json",
  url: "cone.geojson",
  success: function(data) {
      $(data.features).each(function(key, data) {
          cone.addData(data);
      });
  }
});

function plotPoints(data) {
  var arr = [];

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

    arr.push([lat, lon]);
  });

  var polyline = L.polyline(arr, {
    color: '#59C9A5',
    smoothFactor: 1.0
  }).addTo(map);

  polyline.bringToBack();

  map.fitBounds(polyline.getBounds());
}
