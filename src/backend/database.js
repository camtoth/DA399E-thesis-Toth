const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    plot:{
        type:String
    } ,
    genres:[{
        type:String
    }],
    runtime:{
        type:Number
    },
    cast:[{
        type: String
    }],
    num_mflix_comments:{
        type: Number
    },
    title:{
        type: String
    },
    countries:[{
        type: String
    }],
    released:{
        type: Date
    },
    directors:[{
        type: String
    }],
    rated:{
        type: String
    },
    awards:{
        wins:{
            type: Number
        },
        nominations: {
            type: Number
        },
        text: {
            type: String
        }
    },
    lastupdated:{
        type: String
    },
    year: {
        type: Number
    },
    imdb:{
        rating: {
            type: Number
        },
        votes:{
            type: Number
        },
        id:{
            type: Number
        }
    },
    type: {
        type: String
    },
    tomatoes:{
        viewer:{
            rating: {
                type: Number
            },
            numReviews:{
                type: Number
            },
            meter:{
                type: Number
            }
        },
        lastupdated: {
            type:Date
        }
    }


}, {collection: 'movies'})

const movie = mongoose.model('Movies', movieSchema, 'movies')

async function findAll(model) {
    let movieResult = await model.find().limit(10) //just for debugging purposes, to only work with a handful of movies 
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
    
module.exports = {createDBConnection, getMovies, getMovieByTitle}