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
    var speed = ktsToMph(value.Movement.Speed.Imperial.Value);
    var lat = value.Position.Latitude;
    var lon = value.Position.Longitude;

    // var circle = L.circle([lat, lon], {
    //   color: '#D81E5B',
    //   fillColor: '#FFFD98',
    //   fillOpacity: 0.5,
    //   radius: getRadius(value.SustainedWind.Imperial.Value)
    // }).addTo(map);
    //
    // circle.bindPopup(value.Storm.Name + ': ' + value.Status + ' - ' + speed + 'mph');

    var icon = L.icon({
      iconUrl:      getIcon(value.SustainedWind.Imperial.Value),
      iconSize:     [40.5, 25], // size of the icon
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([lat, lon], {icon: icon}).addTo(map);

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

function getIcon(wind) {
  var windspeedInMph = ktsToMph(wind);

  if (windspeedInMph > 155) {
    // category 5
    return 'images/cat-5.png';
  } else if (windspeedInMph >= 131 && windspeedInMph <= 155) {
    // category 4
    return 'images/cat-4.png';
  } else if (windspeedInMph >= 111 && windspeedInMph <= 130) {
    // category 3
    return 'images/cat-3.png';
  } else if (windspeedInMph >= 96 && windspeedInMph <= 110) {
    // category 2
    return 'images/cat-2.png';
  } else if (windspeedInMph >= 74 && windspeedInMph <= 95) {
    // category 1
    return 'images/cat-1.png';
  } else if (windspeedInMph >= 39 && windspeedInMph <= 73) {
    // tropical storm
    return 'images/trop-storm.png';
  } else if (windspeedInMph <= 38) {
    // tropical depression
    return 'images/trop-depression.png';
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
