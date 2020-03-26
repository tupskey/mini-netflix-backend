var express = require('express');
var bodyParser  = require('body-parser');
var mongoose = require('mongoose');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const Films = require('../models/film');

var favRouter = express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')
.get(authenticate.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('films')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
        
    }, (err) => next(err))
    .catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite) {
            for(var i = 0; i<req.body.length; i++) {
                if(favorite.films.indexOf(req.body[i]._id) === -1) {
                    favorite.films.push(req.body[i]._id)
                }
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('films')
                .then((favorites) => {
                    console.log('Favorite Created..', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites})
                })
            }, (err)=> next(err));
        }
        else{
            Favorites.create({"user": req.user._id, "films": req.body})
            .then((favorite) => {
                console.log('Favorite Created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err)=> next(err))
        }
    }, (err)=> next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res,next)=> {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err))
});

favRouter.route('/:filmId')
.get(authenticate.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if(!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites})
        }else{
            if(favorites.films.indexOf(req.params.filmId) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites})
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites})
            }
        }
    })
    .catch((err) => next(err))
})

.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite) {
            if(favorite.films.indexOf(req.params.filmId) === -1){
                favorite.films.push(req.params.filmId)
                favorite.save()
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('films')
                .then((favorites) => {
                    console.log('favorite created', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites})
                }, (err)=> next(err))
            }
        }else{
            Favorites.create({"user": req.user._id, "films": [req.params.filmId]})
            .then((favorite) => {
                console.log('favorite Created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err)=> next(err))
        }
    }, (err)=> next(err))
    .catch((err)=> next(err));
})

.delete(authenticate.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite) {
            index = favorite.films.indexOf(req.params.filmId);
            if(index >= 0){
                favorite.films.splice(index, 1);
                favorite.save()
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('films')
                    .then((favorites)=> {
                        console.log('favorite created');
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({"exists": false, "favorites": favorites})
                    }, (err)=> next(err));
            }
            else{
                err = new Error('Film '  + req.params.filmId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else{
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

module.exports = favRouter;


