const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
var filmRouter = express.Router();
filmRouter.use(bodyParser.json())
const Film = require('../models/film');
const multer = require('multer');


// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, 'public/images')
//     },
//     filename: (req, file , callBack) => {
//         callBack(null, file.originalname)
//     }
// })

// const upload = multer({ storage : storage})



filmRouter.get('/', (req, res, next) => {
    Film.find({})
    .then(resp => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(resp)
    })
    .catch(err=> {
        next(err)
    })
});

filmRouter.post('/', (req, res, next)=> {
    Film.create(req.body, (error, data)=> {
        if(error){
            return next(error)
        }else{
            res.json(data)
        }
    })
})

filmRouter.delete('/', (req, res, next)=> {
  Film.remove()
  .then((resp)=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  })  
});

// filmRouter.get('/:id', (req, res, next) => {
//     Film.findById(req.params.id, (err, data) => {
//         if(err){
//             next(err);
//         }else{
//             res.statusCode = 200;
//             res.setHeader('Content-Type','application/json')
//             res.json(data);
//         }
//     })  
// });

filmRouter.get('/:id', (req, res, next)=> {
    Film.findOne({_id: req.params.id}, (err, data)=> {
        if(err){
            next(err)
        }else{
            res.json(data);
        }
    })
})


filmRouter.put('/:id', (req, res, next) => {
    Film.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if(error){
            return next(error)
        }else{
            res.json(data);
        }
    })
});

filmRouter.delete('/:id', (req, res, next) => {
    Film.findByIdAndRemove(req.params.id, (error, data)=> {
        if(error){
            next(error)
        }else{
            res.json(data);
        }
    })
});


// filmRouter.route('/:id')
// .get((req, res, next)=> {
//     Film.findById(req.params.id, (error, data) => {      
//     if(error){
//          next(error);
//     }
//     else{
//         res.json(data);
//     }
//     })
// })
// .put((req, res, next)=> {
//     Film.findByIdAndUpdate(req.params.id, {
//         $set: req.body
//     }, (error, data) => {
//         if(error){
//             return next(error)
//         }
//         else{
//             res.json(data);
//         }
//     })
// })
// .delete((req, res, next)=> {
//     Film.findByIdAndRemove(req.params.id, (err, data)=> {
//         if(err){
//             return next(err);
//             console.log(err)
//         }else{
//             res.json({msg: data})
//         }

//     })
// })


module.exports = filmRouter;