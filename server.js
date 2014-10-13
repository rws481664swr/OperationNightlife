#!/usr/bin/env nodejs --harmony

'use strict';
var express = require('express');
var bodyParser = require('body-parser'); // this allows us to pass JSON values to the server (see app.put below)
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/nightlife');


// serve static content from the public folder 
app.use("/", express.static(__dirname + '/'));


// parse the bodies of all other queries as json
app.use(bodyParser.json());


// log the requests
app.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, JSON.stringify(req.body));
    //console.log("myData = "+JSON.stringify(myData));
    next();
});

//TODO: Implement methods to push an update location request to a user's phone, update the database with that information, and return the current locations to the original requestor's device

// get a particular item from the model
app.get('/model/:users/:id', function(req, res) {
    var users = db.get(req.params.users);
    users.find({_id: req.params.id}, {}, function(e, docs) {
        console.log(JSON.stringify(docs));
        if (docs.length>0)
            res.json(200, docs[0]);
        else
            res.json(404,{});
    })
});


// get all items from the model
app.get('/model/:users', function(req, res) {
    var users = db.get(req.params.users);
    users.find({}, {}, function(e, docs) {
        console.log(JSON.stringify(docs));
        res.status(200).json(docs);
    })
});

// change an item in the model
app.put('/model/:users/:id', function(req, res) {
    var users = db.get(req.params.users);
    users.update({
        "_id": req.params.id,
        "position": req.data
    });
    res.json(200, {});
});

// add new item to the model
app.post('/model/:users', function(req, res) {
    console.log("post ... " + JSON.stringify(req.body));
    var users = db.get(req.params.users);
    var promise = users.insert(req.body);
    promise.success(function(doc){res.json(200,doc)});
    promise.error(function(error){res.json(404,error)});
});

// delete a particular item from the model
app.delete('/model/:users/:id', function(req, res) {
    var id = req.params.id;
    console.log("deleting " + id);
    var users = db.get(req.params.users);
    users.remove({
        _id: id
    });
    res.json(200, {});
});


// listen on port 5000
var port = 5000;
app.listen(port, function() {
    console.log("server is listening on port " + port);
});

