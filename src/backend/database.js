const mongoose = require('mongoose')

function createDBConnection() {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to mongoDB!'))
        .catch(err => console.error('Could not connect to database.', err))
}

module.exports = createDBConnection