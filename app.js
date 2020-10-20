const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
var config = require('./config');
var passport = require('passport')
var authenticate = require('./authenticate');
const nodemailer = require('nodemailer');


var filmRouter = require('./routes/film');
var userRouter = require('./routes/user');
var favRouter = require('./routes/favorites');

const app = express();
const url = config.mongoUrl;
mongoose.connect(url, {
    useNewUrlParser: true
}).then(() => {
    console.log('Database successfully connected')
},
    error => {
        console.log('Database could not connect:' + error)
    }
)

// var corsOptions = {
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200
//   }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));




app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());

app.use('/films', filmRouter);
app.use('/users', userRouter);
app.use('/favorites', favRouter);



const port = process.env.PORT || 8080;
app.route('/*').get((req, res) => {
    res.sendFile(path.resolve((__dirname + '/public/index.html')));
  })

app.listen(port, ()=> {
    console.log('connected to port ' + port)
})

// app.use((req, res, next)=> {
//     next(createError(404))
// })



// module.export = app;