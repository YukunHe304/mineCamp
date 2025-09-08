
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campground.geometry.coordinates,
    zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');


const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`);


const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
	.setPopup(popup)
    .addTo(map);

