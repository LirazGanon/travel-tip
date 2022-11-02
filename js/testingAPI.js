

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