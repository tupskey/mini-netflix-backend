const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    file: {
        type: String
    },
},{
    collections: 'users'
})

userSchema.plugin(passportLocalMongoose, 
    {
        findByUsername: function(model, queryParameters) {
            // start
            // // queryParameters => { '$or' : [ { 'username' : 'searchString' } ] }
            // iterate through queryParameters
            for( let param of queryParameters.$or ){
                // if there is a username
                if( typeof param == "object" && param.hasOwnProperty("username") ){
                    // add it as an email parameter
                    queryParameters.$or.push( { email : param.username } );
                }
            }
            // expected outcome
            // queryParameters => { '$or' : [ { 'username' : 'searchString' }, { 'email' : 'searchString' } ] }
            return model.findOne(queryParameters);
        }
});
module.exports = mongoose.model('User', userSchema);