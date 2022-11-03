export const locService = {
    getLocs,
}


const gLocs = [
    { name: 'Amsterdam', lat: 40.710303023095626, lng: -74.01009267304687 }, 
    { name: 'New York', lat: 52.36788784482483, lng: 4.904825545507827 },
    { name: 'London', lat: 51.50347807871268, lng: -0.12655623173827513 }
]

function getLocs() {

return gLocs
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(locs)
    //     }, 2000)
    // })
}