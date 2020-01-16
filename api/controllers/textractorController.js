'use strict';

var crypto = require('crypto');
var fs = require('fs-extra');
var PDFDocument = require('pdfkit');
var officegen = require('officegen');
var request = require('request');
var FormData = require('form-data');
const fetch = require('node-fetch');

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
    

        var response;

        //verify token
        ssn = req.session.token;


       

        if(ssn == req.body.token){

            //gets all images in the folder with the token name
            var path = 'api/files/'+ssn+'/';
            var returnedText;
            fs.readdir(path, function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                //listing all files using forEach
                var formData ={};
                var i= 1;
                files.forEach(function (file) {
                    // file processing
                         formData['file'+i]= {
                              value: fs.createReadStream(path+file),
                              options: {
                                filename: file,
                              }
                        };
                        i+=1;                    
                });
                
                request.post({url:'http://localhost:8000/textractor/convert/', formData: formData}, 
                function cb(err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    }
                        console.log('Upload successful!  Server responded with:', body);

                        response = JSON.parse(body);
                        
                        res.json({ 
                            token : ssn,
                            text : response.ConvertedText
                        });
                });

            });


        

        }else {
            res.json({ error : 'User not identified' });
        }

    
};

exports.download = function(req, res) {

    //verify token
    ssn = req.session.token;

    if(ssn == req.body.token){

        //file format according to choice
        switch(req.body.fileType){
            case "pdf":{
          
                //Create PDF
                const doc = new PDFDocument;
                doc.pipe(fs.createWriteStream('api/files/'+ssn+'/document.pdf'));
                //customize font
                doc.font('api/assets/fonts/Roboto-Black.ttf')
                .fontSize(25)
                .text(req.body.text, 100, 100);
                doc.end();
  
                //Return PDF
                var file = 'api/files/'+ssn+'/document.pdf' ;

                res.setHeader('Content-disposition', 'attachment; filename=document.pdf');
                res.setHeader('Content-type', 'application/pdf');

                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
                break;
            }
            case "word":{

                // Create the word document
                let docx = officegen('docx');
                let pObj = docx.createP();
                pObj.addText(req.body.text,{ bold: true, underline: true,color: '00ffff',align:'center' });    

                docx.on('error', function(err) {
                    console.log(err);
                  });

                res.setHeader('Content-disposition', 'attachment; filename=document.docx');
                res.setHeader('Content-type', 'application/msword');

                docx.generate(res);
                break;
            }
            default:{
                res.json({text : req.body.text});
                break;
            }
        }

        //remove temporary folder and close session
        fs.remove('api/files/'+ssn, (err) => {
            if(err) {
                console.log(err);
            } 
        }); 
        //destroy the session
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
        });

    }else {
        res.json({ error : 'User not identified' });
    }

};

exports.donate = async function(req, res) {
    
    const stripe = require('stripe')('sk_test_RzPlsfSBgiJIWZopii0sfOnw008i6CPjR6'); 

    const token = request.body.stripeToken; // Using Express

    const charge = await stripe.charges.create({
        amount: 999,
        currency: 'usd',
        description: 'Example charge',
        source: token,
    });

    res.send({
        result : charge
    });
 
     
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
