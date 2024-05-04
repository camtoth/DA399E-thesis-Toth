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
    //document.getElementById('js-movietitle').innerHTML = movie.title
    const movieContainerDiv = document.getElementById('js-moviecontainer') 
    movieContainerDiv.innerHTML = `

    <div class="col-4 g-2">
        <div class="card movie-preview"  id = ${movie._id} title = "${movie.title}" style="width: 18rem;">
            <img src=${movie.poster} class="card-img-top img-fluid" alt="Poster for ${movie.title}">
        </div>
    </div>

    <div class="col-7 g-2">
        <div class="row"><h1 id="js-movietitle">${movie.title}</h1></div>
        
        <dl class="row">
        <dt class="col-sm-3">Release year:</dt>
        <dd class="col-sm-9">${movie.year}</dd>
        
        <dt class="col-sm-3">Runtime:</dt>
        <dd class="col-sm-9">${movie.length}</dd>

        <dt class="col-sm-3">Synopsis:</dt>
        <dd class="col-sm-9">${movie.description}</dd>
    </div>`
}

function renderShowtimes() {
    let showtimesDiv = document.getElementById('js-showtimescontainer')
    let htmlToRender = ''
    for(const day in showtimes) {
        const times = showtimes[day]
        htmlToRender += `<div> ${day} </div>`
        times.forEach(showtime => {
            //if(showtime.theater_id == selectedCinemaId || selectedCinemaId === '') { //only render showtimes for current cinema
                htmlToRender+= `
                <input type="radio" class="btn-check" name="options-outlined" id="danger-outlined-${day}-${showtime}" autocomplete="off">
                <label class="btn btn-outline-danger" for="danger-outlined-${day}-${showtime}">${showtime}</label>
            `
            //}
        })
    }
    showtimesDiv.innerHTML += htmlToRender
}

async function init() {
    const movieTitle = sessionStorage.getItem("selectedMovie")
    selectedCinemaId = sessionStorage.getItem("selectedCinemaId")
    movie = await getJsonDataFromEndpoint(`movies/${movieTitle}/details`)
    //showtimes = await getJsonDataFromEndpoint(`showtimes/movies/${movie._id}`)
    showtimes = {
        'Monday' : ['17:30', '19:00'],
        'Tuesday' : ['17:30', '21:00'],       
        'Wendsday' : ['21:00'],
        "Thursday" : ['17:30', '19:30', '21:00']
    }

    renderMovieDetails()
    renderShowtimes()
}

init()