'use strict';

var crypto = require('crypto');
var fs = require('fs');

var ssn; //Session variable



exports.upload = function(req, res) {

    var multiparty = require('multiparty');
    var form = new multiparty.Form();
    
    //Create session
    ssn = req.session;

    //Generate Token
    var token = crypto.randomBytes(64).toString('hex');
    ssn.token = token;

    //Store the image with token name (async)
    form.parse(req, function(err, fields, files) {  

        var imgArray = files;
        //console.log(imgArray.file[0].originalFilename);
        var images = [imgArray.file1[0]];
        if(imgArray.file2) images.push(imgArray.file2[0]);
        if(imgArray.file3) images.push(imgArray.file3[0]);
        if(imgArray.file4) images.push(imgArray.file4[0]);
        if(imgArray.file5) images.push(imgArray.file5[0]);


        fs.mkdirSync('api/files/'+token+'/', { recursive: true });
        var path = 'api/files/'+token+'/';
        
        var i;
        for (i=0;i<images.length;i++) {
   
            var newPath = path;
            var singleImg = images[i];
            newPath+= singleImg.originalFilename;          
            readAndWriteFile(singleImg, newPath);

        }
    
    });

    //return token name
    res.json({ token : token });
};

exports.convert = function(req, res) {
    

        //verify token
        ssn = req.session.token;

        if(ssn == req.body.token){

            //converts all images in the folder with the token name

            //returns text

        res.json({ token : ssn });

        }else {
            res.json({ error : 'User not identified' });
        }

    
};

exports.download = function(req, res) {

    

    //verify token
    ssn = req.session.token;

    if(ssn == req.body.token){

        //Modified Text Processing

        //Selecting a file format
        
        //Returns the file to download

        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
        });
        res.json("download");

    }else {
        res.json({ error : 'User not identified' });
    }

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



//Business Functions 
function readAndWriteFile(singleImg, newPath) {

    fs.readFile(singleImg.path , function(err,data) {
        fs.writeFile(newPath,data, function(err) {
            if (err) console.log('Cannot Copy image to folder :'+err);
            //console.log('Fitxer: '+singleImg.originalFilename +' - '+ newPath);
        });
    });
}