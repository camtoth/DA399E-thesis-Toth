let movie
let showtimes = []
let cinemas = []
let selectedCinemaId
let selectedCinemaName

async function getJsonDataFromEndpoint(APIendpoint) {
    const response = await fetch(`../${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
}

function selectCinema() {
    selectedCinemaId = 1 // makes not null
    renderShowtimes()
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
        htmlToRender += `<div class = "row"> ${day} </div> 
            <div class = "row my-2"> `
        times.forEach(showtime => {
            //if(showtime.theater_id == selectedCinemaId || selectedCinemaId === '') { //only render showtimes for current cinema
            htmlToRender+= `
                <div class = "col-auto ">
                    <input type="radio" class="btn-check" name="options-outlined" id="primary-outlined-${day}-${showtime}" autocomplete="off">
                    <label class="btn btn-outline-primary" for="primary-outlined-${day}-${showtime}">${showtime}</label>
                </div>
                `
            //}
        })
        htmlToRender += '</div><hr>'
    }
    showtimesDiv.innerHTML += htmlToRender
}

function renderCinemas() {
    const htmlDiv = document.getElementById('js-cinemaslist')
    let htmlToRender = ''
    let lastCity = ''
    cinemas.forEach(cinema => {
        if(lastCity != cinema.city) {     //first element
            htmlToRender += `<hr><option id=${cinema._id} value="${cinema.name}">${cinema.city}</option>`
        } 
        lastCity = cinema.city
        htmlToRender += `
                <option id=${cinema._id} value="${cinema.name}" class="cinema-list-element"> 
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${cinema.name} (${cinema.city})
                </option>
            `
    })
    htmlDiv.innerHTML += htmlToRender

    htmlDiv.addEventListener('change', selectCinema, false)

}

async function init() {
    const movieTitle = sessionStorage.getItem('selectedMovie')
    selectedCinemaId = sessionStorage.getItem('selectedCinemaId')
    movie = await getJsonDataFromEndpoint(`movies/${movieTitle}/details`)
    cinemas = await getJsonDataFromEndpoint('cinemas')

    //showtimes = await getJsonDataFromEndpoint(`showtimes/movies/${movie._id}`)
    showtimes = {
        'Today' : ['11:30', '17:30', '19:30', '21:00'],
        'Tomorrow': ['11:30', '15:30', '17:30', '19:30', '21:00'],
        'Monday' : ['17:30', '19:00'],
        'Tuesday' : ['17:30', '21:00'],       
        'Wednesday' : ['21:00'],
        'Thursday' : ['17:30', '19:30', '21:00']
    }

    renderMovieDetails()
    renderCinemas()
    if(selectedCinemaId) {
        document.getElementById(selectedCinemaId).selected = 'selected'
        renderShowtimes()
    } 
   
}

init()