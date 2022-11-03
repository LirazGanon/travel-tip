import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'
import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    addPlace,
    getPlaces,
    removePlace,
    getPlaceById,
    askForWeather,
    askForLocation,
    getPlacesAsCSV
}


// Var that is used throughout this Module (not global)
const STORAGE_KEY_PLACES = 'places'

let gMap
let gPlaces
_createPlaces()

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

function getPlaceById(placeId) {
    return gPlaces.find(p => p.id === placeId)
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
    return gMap
}

function addPlace(name, lat, lng, zoom) {
    console.log(name, lat, lng, zoom)
    const currPlace = { id: utilService.makeId(), lat, lng, name, zoom, createdAt: Date.now(), updatedAt: Date.now() }
    gPlaces.unshift(currPlace)
    _savePlacesToStorage()

}

function removePlace(placeId) {
    gPlaces = gPlaces.filter(p => p.id !== placeId)
    _savePlacesToStorage()
}

function _createPlaces() {
    let places = storageService.load(STORAGE_KEY_PLACES)
    if (!places || !places.length) {
        const newPlaces = locService.getLocs()
        places = newPlaces.map(({ name, lat, lng }) => _createPlace(name, lat, lng))
    }
    gPlaces = places
    _savePlacesToStorage()
}

function _createPlace(name, lat, lng, zoom = 15) {
    return { id: utilService.makeId(), lat, lng, name, zoom, createdAt: Date.now(), updatedAt: Date.now() }
}

function _savePlacesToStorage() {
    storageService.save(STORAGE_KEY_PLACES, gPlaces)
}


function askForWeather(lat, lng) {
    const API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=65505f532c6a14c573f169722f2b0004`
    return axios.get(API).then(({ data }) => {
        let results = {
            temp: data.list[0].main.temp - 272.15,
            weather: data.list[0].weather
        }
        return results
    })
}

function askForLocation(placeName) {
    const API = `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=AIzaSyBTX43qLb5Eha5DhsfCtwbNURcj3m2qqRw`
    return axios.get(API)
        .then(({ data }) => {
            let results = {
                name: data.results[0].formatted_address,
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng
            }
            return results
        })
}

function getPlacesAsCSV() {
    if (!gPlaces.length) return 'No Places'
    const csv = gPlaces.map(({ name, lat, lng }) => `${name},${lat},${lng}\n`)
    csv.unshift('Name,Latitude ,Longitude\n')
    return csv.join('')
}


