var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let FavSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    films: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Film'
        }
    ],
    
},{
    collection: 'favorites'
})

module.exports = mongoose.model('Favorites', FavSchema) 