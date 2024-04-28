//global variables
let movies = []

async function getJsonDataFromEndpoint(APIendpoint) {
    const response = await fetch(`../${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
  }

function goToMovieDetails(e) {
    window.location.href = `/movies/${e.currentTarget.title}` 
}

function renderMovies() {
    const htmlDiv = document.getElementById('js-moviescontainer')
    let htmlToRender = ''
    movies.forEach(movie => {
            htmlToRender += `
                <div id = ${movie._id} title = "${movie.title}" class ="movie-preview"> Title: ${movie.title}
                    <img src=${movie.poster} alt="Poster for ${movie.title}">
                </div>
            `
    }) 
    htmlDiv.innerHTML = htmlToRender
}

function initMovieEventListeners() {
    const moviesDivList = document.querySelectorAll('.movie-preview')
    moviesDivList.forEach(movieDiv => {
        movieDiv.addEventListener('click', goToMovieDetails, false) //listener is currently added to the whole movie div
        movieDiv.title = `${movieDiv.title}`
    })
}

async function init() {
    movies = await getJsonDataFromEndpoint("movies")
    renderMovies()
    initMovieEventListeners()
}

init()