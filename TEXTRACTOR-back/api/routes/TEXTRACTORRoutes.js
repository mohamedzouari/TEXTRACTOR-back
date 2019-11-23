'use strict';
module.exports = function(app) {
  var textractor = require('../controllers/TEXTRACTORController');

  app.route('/getFormat/:format')
    .get(textractor.getFileFormat);
};
