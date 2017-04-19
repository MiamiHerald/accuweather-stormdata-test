// Libraries
import $ from 'jquery';

// FOR DEVELOPMENT
import 'leaflet/dist/leaflet-src';

// FOR PRODUCTION
// import 'leaflet/dist/leaflet';

// Globals
var mapId             = 'mapid',
    initCoords        = [25.7617, -80.1918],
    initZoom          = 13,
    mapBoxAccessToken = 'pk.eyJ1IjoiY2hyaXNkdWJ5YSIsImEiOiJjaXRkZDNydnkwMDY4MnRtOTA2Y3hoaGh4In0.kzOT6chkFRIklbX08xiGew',
    mabBoxStyleURL    = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=' + mapBoxAccessToken,
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

  // Initialize empty cone and add to map
  var cone = new L.geoJson();
  cone.addTo(map);
  cone.bringToBack();

  // Load geoJson data into cone object
  $.getJSON(geoJsonURL, function(data) {
    $.each(data.features, function(key, data) {
      cone.addData(data);
    });
  });

  $.getJSON(stormURL, function(data) {
    plotPoints(data);
  });
}


function plotPoints(data) {
  // Render circle for each object in the Array,
  // also push the coordinates into polylineArray to create polyline
  $.each(data, function(index, value) {
    var speed = ktsToMph(value.SustainedWind.Imperial.Value);
    var lat = value.Position.Latitude;
    var lon = value.Position.Longitude;

    var icon = L.icon({
      iconUrl:      getIcon(speed),
      iconSize:     [40.5, 25], // size of the icon
    });

    L.marker([lat, lon], {icon: icon}).addTo(map)
        .bindPopup(value.Storm.Name + ': ' + value.Status + ' - ' + speed + 'mph');;

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

function getIcon(speed) {
  if (speed > 155) {
    // category 5
    return 'images/cat-5.svg';
  } else if (speed >= 131 && speed <= 155) {
    // category 4
    return 'images/cat-4.svg';
  } else if (speed >= 111 && speed <= 130) {
    // category 3
    return 'images/cat-3.svg';
  } else if (speed >= 96 && speed <= 110) {
    // category 2
    return 'images/cat-2.svg';
  } else if (speed >= 74 && speed <= 95) {
    // category 1
    return 'images/cat-1.svg';
  } else if (speed >= 39 && speed <= 73) {
    // tropical storm
    return 'images/trop-storm.svg';
  } else if (speed <= 38) {
    // tropical depression
    return 'images/trop-depression.svg';
  }
}

// convert kts to miles per hour
function ktsToMph(value) {
  return round((value * 1.15078), 1);
}

// rounding function
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

$(function() {
  initMap();
});
