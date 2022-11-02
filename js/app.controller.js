import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onMenu = onMenu


let gMap

function onInit() {
    mapService.initMap()
        .then((res) => {
            gMap = res
            console.log('Map is ready')
            console.log(gMap)
            addEventListeners()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function onMenu() {
    document.querySelector('body').classList.toggle('menu-open')
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(loc) {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function addEventListeners() {
    gMap.addListener('click', ev => {
        console.log('ev', ev);
        const name = prompt('Place name?', 'New Place')
        const { latLng: { lat, lng } } = ev
        // const { latLng } = ev
        // const lat = ev.latLng.lat()
        // const lng = ev.latLng.lng()

        console.log('lat, lng', lat, lng);
        // addPlace(name, lat, lng, gMap.getZoom())
        // renderPlaces()
        // renderMarkers()
    })
}
