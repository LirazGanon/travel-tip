import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onMenu = onMenu
window.onAddPlace = onAddPlace
window.onCloseModal = onCloseModal
window.omModalClick = omModalClick
window.onRemovePlace = onRemovePlace
window.onPanToPlace = onPanToPlace
window.onPanToUserLoc = onPanToUserLoc



let gMap
let gMarkers = []
let gCurrCoords

function onInit() {
    mapService.initMap()
        .then((res) => {
            gMap = res
            console.log('Map is ready')
            addEventListeners()
            renderPlaces()
            renderMarkers()
            const locationButton = document.createElement('button')
            locationButton.classList.add('my-location')
            locationButton.innerHTML = `<img src="img/my-location.png" />`
            gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton)
            locationButton.addEventListener('click', onPanToUserLoc)
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
        const body = document.querySelector('body')
        body.classList.add('modal-open')
        document.querySelector('.add-input').focus()
        const { latLng } = ev
        const lat = latLng.lat()
        const lng = latLng.lng()
        gCurrCoords = { lat, lng }

    })
}

function onAddPlace(ev) {
    ev.preventDefault()
    const name = ev.target.placeName.value
    const { lat, lng } = gCurrCoords
    mapService.addPlace(name, lat, lng, gMap.getZoom())
    renderPlaces()
    renderMarkers()
    onCloseModal()
    ev.target.placeName.value = ''
}

function renderPlaces() {
    const places = mapService.getPlaces()
    const elList = document.querySelector('.locations-list')
    const strHtmls = places.map(({ id, name }) => {
        return `
    <li class="location-items flex space-between align-center">
        <h2>${name}</h2 >
        <div class="controls flex">
            <button class="flex center" onclick="onPanToPlace('${id}')"><ion-icon name="navigate"></ion-icon></button>
            <button class="flex center" onclick="onRemovePlace('${id}')"><ion-icon name="trash"></ion-icon></button>
        </div>
    </li>
        `
    }).join('')

    renderWeather(places[0])
    elList.innerHTML = strHtmls
}


function renderWeather({ name, lat, lng }) {
    mapService.askForWeather(lat, lng).then(res => {
        const temp = Math.round(res.temp)
        const { icon, description } = (res.weather[0])

        document.querySelector('.location').innerText = name
        document.querySelector('.celsius').innerText = temp + '°'
        document.querySelector('.weather img').src = `http://openweathermap.org/img/wn/${icon}@2x.png`
        document.querySelector('.weather-desc').innerText = description
    })
}


function renderMarkers() {
    const places = mapService.getPlaces()
    // remove previous markers
    gMarkers.forEach(marker => marker.setMap(null))
    // create a marker for every place
    gMarkers = places.map(({ lat, lng, name }) => {
        const coord = { lat, lng }
        return new google.maps.Marker({
            position: coord,
            map: gMap,
            title: name
        })
    })
}

function onRemovePlace(placeId) {
    console.log('placeId', placeId);
    mapService.removePlace(placeId)
    renderPlaces()
    renderMarkers()
}

function onPanToPlace(placeId) {
    const selectedPlace = mapService.getPlaceById(placeId)
    renderWeather(selectedPlace)
    gMap.setCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng })
    gMap.setZoom(selectedPlace.zoom)
}

function onPanToUserLoc() {
    navigator.geolocation.getCurrentPosition(setCenterToUserLoc)
}

function setCenterToUserLoc({ coords }) {
    const { latitude: lat, longitude: lng } = coords
    console.log('lat,lng', lat, lng);
    gMap.setCenter({ lat, lng })
}


function onCloseModal() {
    document.querySelector('body').classList.remove('modal-open')
}

function omModalClick(ev) {
    ev.stopPropagation()
}