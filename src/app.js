const APIKey = 'pk.eyJ1Ijoibmlja28xIiwiYSI6ImNrd3o2MTU5ejBydGwybm1raXNrdzVyMTYifQ.GJ6eL_Q7ltDLLzW572Q5iA';
const APICall = 'https://api.mapbox.com/';

let lat;
let long;
let changeMap;

navigator.geolocation.getCurrentPosition(location => {
  lat = location.coords.latitude;
  long = location.coords.longitude;
  mapboxgl.accessToken = `${APIKey}`;
  
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [long, lat],
  zoom: 12
  });

  const startingMarker = new mapboxgl.Marker().setLngLat([long, lat]).addTo(map);

  getCurrentLocation(long, lat);

  return changeMap = map;
});

function getDistance(lat1, lat2, long1, long2) {
  const earthRadius = 6371;
  const degLat = degRadius(lat2 - lat1);
  const degLong = degRadius(long2 - long1);

  const a =
    Math.sin(degLat/2) * Math.sin(degLat/2) +
    Math.cos(degRadius(lat1)) * Math.cos(degRadius(lat2)) *
    Math.sin(degLong/2) * Math.sin(degLong/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c;
  return d;
}

function degRadius(degree) {
  return degree * (Math.PI/180);
}

function getCurrentLocation(longitude, latitude) {
  return fetch(`${APICall}geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&limit=1&access_token=${APIKey}`)
    .then(response => response.json())
    .then(data => getPointsOfInterest(data.features[0].text, longitude, latitude));
}

function getPointsOfInterest(currentLocation, proximityLong, proximityLat) {
  return fetch(`${APICall}geocoding/v5/mapbox.places/${currentLocation.toLowerCase()}.json?types=poi&limit=10&proximity=${proximityLong},${proximityLat}&access_token=${APIKey}`)
    .then(response => response.json())
    .then(data => renderPOI(data.features));
}

function renderPOI(features) {
  const POIObjects = [];

  features.forEach(POI => {
    let thisPlace = new Object();
    thisPlace.name = POI.text;
    thisPlace.address = POI.properties.address;
    thisPlace.longitude = POI.geometry.coordinates[0];
    thisPlace.latitude = POI.geometry.coordinates[1];
    thisPlace.distance = getDistance(lat, POI.center[1], long, POI.center[0]);
    POIObjects.push(thisPlace);
  });

  POIObjects.sort((a, b) => a.distance - b.distance);
  document.querySelectorAll('.poi').forEach(pointHTML => pointHTML.remove());

  POIObjects.forEach(poi => {
    pointsOfInterest.insertAdjacentHTML('beforeend', `
      <li class="poi" data-long="${poi.longitude}" data-lat="${poi.latitude}">
      <ul>
        <li class="name">${poi.name}
        </li><li class="street-address">${poi.address}
        </li><li class="distance">${poi.distance.toFixed(1)} KM
        </li></ul>
      </li>`)
  });
}

const searchEl = document.querySelector('form');
searchEl.addEventListener('submit', e => {
  e.preventDefault();
  if (searchEl.firstElementChild.value !== '') {
    return fetch(`${APICall}geocoding/v5/mapbox.places/${searchEl.firstElementChild.value}.json?types=place&limit=1&access_token=${APIKey}`)
      .then(response => response.json())
      .then(data => getPointsOfInterest(data.features[0].text, data.features[0].center[0], data.features[0].center[1]));
  }
});

const pointsOfInterest = document.querySelector('.points-of-interest');
pointsOfInterest.addEventListener('click', e => {
  if (e.target.className === 'poi') {
    const targetLat = e.target.getAttribute('data-lat');
    const targetLong = e.target.getAttribute('data-long');
    let newMarker = new mapboxgl.Marker().setLngLat([targetLong,targetLat]).addTo(changeMap);
    changeMap.flyTo({center: [targetLong,targetLat]});
  }
});