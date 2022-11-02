


function askForWeather(lat, lon) {
    const API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=65505f532c6a14c573f169722f2b0004`
    console.log(API);
    return axios.get(API).then(console.log)
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


const themes = {
    light:{text:'#333333',bg:'#eeeeee',break:'#555555',prColor:'#85c446'},
    dark:{text:'#eeeeee',bg:'#333333',break:'#e5e5e5',prColor:'#82b541'},
    warm:{text:'#333333',bg:'#eeeeee',break:'#555555',prColor:'#fdca30'},
    cold:{text:'#eeeeee',bg:'#4682b4',break:'#2c2b2b',prColor:'#999999'},
}

function onChangeTheme(theme){
    const curTheme = themes[theme]
    if(!curTheme) return
    document.documentElement.style.setProperty('--text', curTheme.text);
    document.documentElement.style.setProperty('--bg', curTheme.bg);
    document.documentElement.style.setProperty('--break', curTheme.break);
    document.documentElement.style.setProperty('--pr-clr', curTheme.prColor);
    console.log(theme);
    console.log(curTheme);
}

