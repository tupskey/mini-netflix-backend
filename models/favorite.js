var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let FavSchema = new Schema({
    films: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Film'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Favorites', FavSchema) 