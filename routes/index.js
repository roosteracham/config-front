var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('config');
});

router.get('/index', function(req, res, next) {
    res.render('config');
});
module.exports = router;
