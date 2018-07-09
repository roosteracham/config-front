var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
    res.render('test');
});

router.get('/index', function(req, res, next) {
    res.render('config');
});
module.exports = router;
