require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movieData = require('./data.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.disable('x-powered-by')
app.use(cors())

app.use(function validateBearerToken( req, res, next) {
    debugger
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized attempt'})
    }
    next()
})

function getMovies(req, res) {
    let response = movieData;

    if(req.query.genre) {
        response = response.filter(movie => 
            movie.genre.includes(req.query.genre)
        )}
    if(req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().replace(/\s+/g, '').includes(req.query.country.toLowerCase().replace(/\s+/g, ''))
        )}
    if(req.query.avg_vote) {
        response = response.filter(movie =>
            movie.avg_vote >= req.query.avg_vote
        )}

    res.send(response)
}

app.get("/movie", getMovies) 

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})