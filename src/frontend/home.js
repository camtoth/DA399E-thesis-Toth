//global variables
let movies = []
let cinemas = []
let selectedCinema = ''

async function getJsonDataFromEndpoint(APIendpoint) {
    const response = await fetch(`../${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
}

function goToMovieDetails(e) {
    window.location.href = `/movies/${e.currentTarget.title}` 
}

function selectCinema(e) {
    selectedCinema = cinemas.find((cinema) => cinema.name == e.currentTarget.value);
    window.location.href = `/#${e.currentTarget.value}}`
}

function renderMovies() {
    const htmlDiv = document.getElementById('js-moviescontainer')
    let htmlToRender = ''
    movies.forEach(movie => {
        htmlToRender += `
                <span id = ${movie._id} title = "${movie.title}" class ="movie-preview"> 
                    <div>Title: ${movie.title}</div>
                    <img src=${movie.poster} alt="Poster for ${movie.title}">
                </span>
            `
    })
    htmlDiv.innerHTML = htmlToRender
}

function renderCinemas() {
    const htmlDiv = document.getElementById('js-cinemaslist')
    let htmlToRender = ''
    let lastCity = ''
    cinemas.forEach(cinema => {
        if(lastCity == '') {     //first element
            htmlToRender += `<optgroup label = "${cinema.city}">`
        } else if(lastCity != cinema.city) {
            htmlToRender += `</optgroup>
            <optgroup label = "${cinema.city}">`
        } 
        lastCity = cinema.city
        htmlToRender += `
                <option id=${cinema._id} value="${cinema.name}" class="cinema-list-element"> 
                    ${cinema.name} (${cinema.city})
                </option>
            `
    })
    htmlToRender += '</optgroup>'
    htmlDiv.innerHTML += htmlToRender
}

function initMovieEventListeners() {
    const moviesDivList = document.querySelectorAll('.movie-preview')
    moviesDivList.forEach(movieDiv => {
        movieDiv.addEventListener('click', goToMovieDetails, false) //listener is currently added to the whole movie div
        movieDiv.title = `${movieDiv.title}`
    })
}

function initCinemaListEventListeners() {
    const cinemasList = document.getElementById('js-cinemaslist')
    cinemasList.addEventListener('change', selectCinema, false)
}

async function init() {
    movies = await getJsonDataFromEndpoint('movies')
    cinemas = await getJsonDataFromEndpoint('cinemas')

    //render and populate html
    renderMovies()
    renderCinemas()

    //init listeners, must be done after render
    initMovieEventListeners()
    initCinemaListEventListeners()
}

init()