'use strict';

var express = require('express')
const app = express();
var crypto = require('crypto');
var fs = require('fs');

var ssn; //Session variable



exports.upload = function(req, res) {
    
    //Create session
    ssn = req.session;
    console.log(ssn);

    //Get the Image file


    //Generate Token
    var token = crypto.randomBytes(64).toString('hex');
    ssn.token = token;

    //Store the image with token name (async)
        //create folder with token name
        //store all images

    //return token name
    res.json({ token : token });
};

exports.convert = function(req, res) {
    
    //verify token
    ssn = req.session;

    //converts all images in the folder with the token name

    //returns text
    
    res.json({ token : ssn.token });
};

exports.download = function(req, res) {

    

    //Verify Token

    //Modified Text Processing

    //Selecting a file format
    
    //Returns the file to download & Session Close

    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    });
    res.json("download");
};

exports.donate = function(req, res) {
    
    //Gets the amount of money to donate

    //Donating Process

    //Returns Result
    res.json("donate");
};

exports.art = function(req, res) {
    
    
    res.json("art");
};


