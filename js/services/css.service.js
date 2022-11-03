
export const cssService ={
    getThemes
}



const gThemes = {
    light: { text: '#333333', bg: '#eeeeee', break: '#555555', prColor: '#85c446' },
    dark: { text: '#eeeeee', bg: '#333333', break: '#e5e5e5', prColor: '#82b541' },
    warm: { text: '#333333', bg: '#eeeeee', break: '#555555', prColor: '#fdca30' },
    cold: { text: '#eeeeee', bg: '#4682b4', break: '#2c2b2b', prColor: '#999999' },
}

function getThemes(){
    return gThemes
}

