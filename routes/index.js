var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('config');
});

router.get('/config.html', function(req, res, next) {
    res.render('config');
});

router.get('/run.html', function(req, res, next) {
    res.render('run');
});

router.get('/login.html', function(req, res, next) {
    res.render('login');
});

router.get('/error.html', function(req, res, next) {
    res.render('error');
});

router.get('/register.html', function(req, res, next) {
    res.render('register');
});

router.get('/emailSent.html', function(req, res, next) {
    res.render('emailSent');
});

router.get('/realTimeTrend.html', function(req, res, next) {
    res.render('realTimeTrend');
});

module.exports = router;
