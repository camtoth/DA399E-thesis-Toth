let movie
let showtimes = []
let selectedCinemaId

async function getJsonDataFromEndpoint(APIendpoint) {
    const response = await fetch(`../${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
}

function renderMovieDetails() {
    document.getElementById('js-movietitle').innerHTML = movie.title
}

function renderShowtimes() {
    let showtimesDiv = document.getElementById('js-showtimescontainer')
    let htmlToRender = ''
    showtimes.forEach(showtime => {
        if(showtime.theater_id == selectedCinemaId) { //only render showtimes for current cinema
            htmlToRender+= `
            <button id= '${showtime._id}'>
                ${showtime.time} 
            </div>
        `
        }
    })
    showtimesDiv.innerHTML += htmlToRender
}

async function init() {
    const movieTitle = sessionStorage.getItem("selectedMovie")
    selectedCinemaId = sessionStorage.getItem("selectedCinemaId")
    movie = await getJsonDataFromEndpoint(`movies/${movieTitle}/details`)
    showtimes = await getJsonDataFromEndpoint(`showtimes/movies/${movie._id}`)

    renderMovieDetails()
    renderShowtimes()
}

init()