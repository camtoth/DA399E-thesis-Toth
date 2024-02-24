const express = require('express')
const app = express()

// Routes

app.get('/', (req, res) => {
    res.send('Hello, node!')
})

app.listen(3000, ()=>{
    console.log('Node API is running on port 3000')
})