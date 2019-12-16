'use strict';

const express = require('express');
var router = express.Router();

var textractor = require('../controllers/textractorController');

  // todoList Routes
  router.post('/upload',textractor.upload);

  router.get('/convert',textractor.convert);
  
  router.get('/download',textractor.download);

  router.post('/donate',textractor.donate);

  router.get('/art',textractor.art);
      

module.exports = router;