// FOR DEVELOPMENT
import 'leaflet/dist/leaflet-src';

// FOR PRODUCTION
// import 'leaflet/dist/leaflet';

var mymap = L.map('mapid').setView([25.7617, -80.1918], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiY2hyaXNkdWJ5YSIsImEiOiJjaXRkZDNydnkwMDY4MnRtOTA2Y3hoaGh4In0.kzOT6chkFRIklbX08xiGew'
}).addTo(mymap);
