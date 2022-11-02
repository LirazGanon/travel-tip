import {utilService} from './util.service.js'
import {storageService} from './storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    addPlace,
    getPlaces
}


// Var that is used throughout this Module (not global)
let gMap
let gPlaces =[]
const STORAGE_KEY_PLACES = 'places'

function getPlaces() {
    return gPlaces
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            return gMap
            console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    const API_KEY = ' AIzaSyBTX43qLb5Eha5DhsfCtwbNURcj3m2qqRw' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getMap() {
    console.log(gMap)
    return gMap
}

function addPlace(name, lat, lng, zoom) {
    console.log(name, lat, lng, zoom)
    gPlaces.unshift({ id: utilService.makeId(), lat, lng, name, zoom })
    _savePlacesToStorage()
}

function _createPlaces() {
    const places = storageService.load(STORAGE_KEY_PLACES) || []
    if (!places || !places.length) {
        for (let i = 0; i < 3; i++) {
            const placeName = 'DemoPlace' + (i + 1)
            places.push(_createPlace(placeName, 33 + i, 35 + i, 10))
        }
    }
    gPlaces = places
    _savePlacesToStorage()
}

function _savePlacesToStorage() {
    storageService.save(STORAGE_KEY_PLACES, gPlaces)
}


