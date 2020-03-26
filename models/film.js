const mongoose = require('mongoose');
const Schema = mongoose.Schema

let Film = new Schema({ 
    title: {
        type: String
    },  
    year: {
        type: String
    },
    imageUrl: {
        type: String
    },
    rated: {
        type: String
    },
    runtime: {
        type: String
    },
    genre: {
        type: String
    },
    director: {
        type: String
    },
    language: {
        type: String
    },
    country: {
        type: String
    },
    actors: {
        type: String
    }
},
{
 collection: 'films'   
})

module.exports = mongoose.model('Film', Film);