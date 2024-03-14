const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const {createDBConnection, getMovies} = require('./database')

// *** Routes *** //

app.get('/', (req, res) => {
    res.send('Hello, node!')
})

app.get('/movies', async (req, res) => {
    let movies = await getMovies()
    res.json(movies)
})

app.listen(3000, ()=>{
    console.log('Node API is running on port 3000')
    createDBConnection()

})