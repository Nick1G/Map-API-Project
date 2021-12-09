const APIKey = 'pk.eyJ1Ijoibmlja28xIiwiYSI6ImNrd3o2MTU5ejBydGwybm1raXNrdzVyMTYifQ.GJ6eL_Q7ltDLLzW572Q5iA';

let lat;
let long;

if (!navigator.geolocation) {
  console.log('error');
} else {
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
  });
}