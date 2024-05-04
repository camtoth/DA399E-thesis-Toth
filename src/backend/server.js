const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('', express.static(path.join(__dirname, '../frontend')))

app.use(express.static('../frontend/styles', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css')
        }
    }
}))

const {createDBConnection, getMovies, getMovieByTitle, getMoviesByCinema, getAllShowtimes, getShowtimesByMovieId, getShowtimesByTheaterId, getAllTheaters, generateShowtimeForMovieAtCinema, generateShowtimesForAllMoviesAtCinema} = require('./database')

// *** Routes *** //

app.use(cors({
    origin: '*',
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'))
})

app.get('/movies', async (req, res) => {
    let movies = await getMovies()
    console.log("getting movies")
    res.json(movies)
})

app.get('/movies/:title', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/movie_details.html'))
})

app.get('/movies/:title/details', async (req, res) => {
    let movie = await getMovieByTitle(req.params.title)
    res.json(movie)
})

app.get('/movies/cinema/:cinemaid', async (req, res) => {
    let movies = await getMoviesByCinema(req.params.cinemaid)
    //populate the html with correct data and return it
    res.json(movies)
})

app.get('/showtimes', async (req, res) => {
    let showtimes = await getAllShowtimes()
    res.json(showtimes)
})

app.get('/showtimes/movies/:movieid', async (req, res) => {
    let showtimes = await getShowtimesByMovieId(req.params.movieid)
    console.log(showtimes)
    res.json(showtimes)
})

app.get('/showtimes/cinemas/:theaterid', async (req, res) => {
    let showtimes =  await getShowtimesByTheaterId(req.params.theaterid)
    res.json(showtimes)
})

app.get('/cinemas', async (req, res) => {
    let cinemas = await getAllTheaters()
    cinemas.sort((a, b) => a.city.localeCompare(b.city))
    res.json(cinemas)
})

app.get('/generate/showtimes/:movieTitle/:cinemaName', async (req, res) => { //for dev purposes only
    await generateShowtimeForMovieAtCinema(req.params.movieTitle, req.params.cinemaName)
    res.status(200)
})

app.get('/generate/showtimes/all/:cinemaName', async (req, res) => { //for dev purposes only
    await generateShowtimesForAllMoviesAtCinema(req.params.cinemaName)
    res.status(200)
})


app.listen(process.env.PORT, ()=>{
    console.log(`Node API is running on port ${process.env.PORT}`)
    createDBConnection()

})