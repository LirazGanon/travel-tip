let info

function askForWeather(lat, lon) {
    const API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyB9m12JGUGygC5xGJ6GSY0jgP4DrRAEbhM`
    console.log(API);
    return axios.get(API).then(res => {
        info = res
        return Promise.resolve({
            temp:res.data.list[0].main.temp,
            weather:res.data.list[0].weather

        })

    })
}

function askForLocation(lat,lon){
    const API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyB-AIzaSyB9m12JGUGygC5xGJ6GSY0jgP4DrRAEbhM`
  
    console.log(API);
    return axios.get(API).then(console.log)
}

function getPlacesAsCSV(){
    if(!gPlaces.length) return 'No Places'
    const csv = gPlaces.map(({name,lat,lon})=>`${name},${lat},${lon}\n`)
    csv.unshift('Name,Latitude ,Longitude\n')
    return csv.join('')
}

function onDownloadCSV(elLink){
    const csv = getPlacesAsCSV()
    elLink.href = 'data:text/csv;charset=utf-8,' + csv
}