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
    const movieContainerDiv = document.getElementById('js-moviecontainer') 
    movieContainerDiv.innerHTML = `
    <div class="card movie-preview"  id = ${movie._id} title = "${movie.title}" style="width: 18rem;">
        <img src=${movie.poster} class="card-img-top img-fluid" alt="Poster for ${movie.title}">
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
                Year: ${movie.year}
                Runtime: ${movie.length}
                Synopsis: ${movie.description}
            </p>
        </div>
    </div>`
}

function renderShowtimes() {
    let showtimesDiv = document.getElementById('js-showtimescontainer')
    let htmlToRender = ''
    showtimes.forEach(showtime => {
        if(showtime.theater_id == selectedCinemaId || selectedCinemaId === '') { //only render showtimes for current cinema
            htmlToRender+= `
            <input type="checkbox" id= '${showtime._id}'>
                ${showtime.time} 
            </input>
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