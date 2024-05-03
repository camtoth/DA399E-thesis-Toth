const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title:{
        type:String
    },
    year: {
        type:String
    }, 
    length:{
        type:String
    },
    title:{
        type:String
    },
    poster:{
        type:String
    },
    description:{
        type:String
    }
    
}, {collection: 'movies'})

const showtimesSchema = new mongoose.Schema({
    time:{
        type:Date
    },
    movie_id: {
        type:ObjectId
    }, 
    theater_id:{
        type:ObjectId
    }
}, {collection: 'showtimes'})

const theaterSchema = new mongoose.Schema({
    name:{
        type:String
    }
}, {collection: 'theaters'})

const movie = mongoose.model('Movies', movieSchema, 'movies')
const showtime = mongoose.model('Showtimes', movieSchema, 'showtimes')
const theater = mongoose.model('Theaters', theaterSchema, 'theaters')

async function findAll(model) {
    let movieResult = await model.find() 
    return movieResult
}

function createDBConnection() {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to mongoDB!'))
        .catch(err => console.error('Could not connect to database.', err))
}

async function getMovies() {
    return await findAll(movie)
}

async function getMovieByTitle(title) {
    return await movie.findOne({'title': title})
}

async function getAllShowtimes() {
    return await findAll(showtime)
}

async function getShowtimesByMovieId(movieId) {
    try{
        movieId = new mongoose.Types.ObjectId(String(movieId))
        return await showtime.find({'movie_id': movieId})
    } catch {
        console.error("Invalid id format")
    }
}

async function getShowtimesByTheaterId(theaterId) {
    try {
        theaterId = new mongoose.Types.ObjectId(String(theaterId))
        return await showtime.find({'theater_id': theaterId})
    } catch {
        console.error("Invalid id format")
    }
}
    
async function getAllTheaters() {
    return await findAll(theater)
}

module.exports = {createDBConnection, getMovies, getMovieByTitle, getAllShowtimes, getShowtimesByMovieId, getShowtimesByTheaterId, getAllTheaters}