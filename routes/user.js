const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const passport = require('passport')
const userRouter = express.Router();
const User = require('../models/user');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/image')
    },
    filename: (req, file, callBack)  => {
        callBack(null, file.originalname)
    }
})

const upload = multer({ storage: storage})
userRouter.use(bodyParser.json());

userRouter.get('/', (req, res, next)=> {
    User.find({})
    .then((users)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({users})
    })
    .catch((err)=> next(err))
})

userRouter.post('/signup', (req, res, next)=> {
    User.register(new User({username: req.body.username}),
     req.body.password, (err, user)=> {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err})
        }else{
            if(req.body.firstname)
            user.firstname = req.body.firstname;
           if(req.body.lastname)
           user.lastname = req.body.lastname;
           if(req.body.email)
           user.email = req.body.email;
           user.save((err, user)=> {
               if(err){
                   res.statusCode = 500;
                   res.setHeader('Content-Type', 'application/json');
                   res.json({err: err});
                   return 
               }
               passport.authenticate('local')(req, res, ()=> {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json({success: true, status: 'Registration Sucessful'});
               });
           }); 
        }
    })
})

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,  token: token, status: 'Log in Successful'})
  });

module.exports = userRouter;