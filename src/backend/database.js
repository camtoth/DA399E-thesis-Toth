const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const moment = require('moment');
const showtimesList = [
    "11",
    "14:30",
    "16:30",
    "18",
    "18:30",
    "19",
    "19:30",
    "20",
    "20:30",
    "21:30"
];

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

const showtimeSchema = new mongoose.Schema({
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
    },
    city:{
        type:String
    }
}, {collection: 'theaters'})

const movie = mongoose.model('Movies', movieSchema, 'movies')
const showtime = mongoose.model('Showtimes', showtimeSchema, 'showtimes')
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

async function getMoviesByCinema(theaterId) {
    try {
        const showtimes = await showtime.find({ theater_id: theaterId });
        const movieIds = showtimes.map(showtime => showtime.movie_id);

        const movies = await movie.find({ _id: { $in: movieIds } });

        return movies

    } catch (error) {
        console.error(error)
    }
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

async function generateShowtimeForMovieAtCinema(movieTitle, theaterName) { // only for development purporses, will populate the db with showtimes automatically
    try{
      const movieToInsert = await movie.findOne({ title: movieTitle });
      const theaterToInsert = await theater.findOne({ name: theaterName });

      // Calculate the start date (2 days from now)
      const startDate = moment().add(2, 'days').startOf('day');

      // Calculate the end date (1 week from now)
      const endDate = moment().add(1, 'week').endOf('day');

      // Find existing showtimes for the movie and theater within the date range
      const existingShowtimes = await showtime.find({
          movie_id: movieToInsert._id,
          theater_id: theaterToInsert._id,
          time: { $gte: startDate.toDate(), $lte: endDate.toDate() }
      });

      // Extract existing times from existing showtimes
      const existingTimes = existingShowtimes.map(showtime => moment(showtime.time).format('HH:mm'));

      // Generate showtime entries for specific times in the list, skipping a random time
      const timeToSkipIndex = Math.floor(Math.random() * showtimesList.length);
      for (let i = 0; i < showtimesList.length; i++) {
          if (i === timeToSkipIndex) {
              continue; // Skip the random time
          }

          // Parse the time string and add it to the start date
          const time = showtimesList[i];
          const showtimeDateTime = moment(`${startDate.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');

          // Check if the showtime is within the date range and not already existing
          if (showtimeDateTime.isBetween(startDate, endDate, undefined, '[]') && !existingTimes.includes(time)) {
              const showtimeToInsert = new showtime({
                  time: showtimeDateTime.toDate(),
                  movie_id: movieToInsert._id,
                  theater_id: theaterToInsert._id
              });

              await showtimeToInsert.save();
          }
      }

      console.log('Showtimes generated successfully');
  } catch (e) {
      console.error('Error generating showtimes:', e.message);
  }
}

module.exports = {createDBConnection, getMovies, getMovieByTitle, getMoviesByCinema, getAllShowtimes, getShowtimesByMovieId, getShowtimesByTheaterId, getAllTheaters, generateShowtimeForMovieAtCinema}