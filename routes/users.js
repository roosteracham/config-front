var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
    res.render('test');
});

router.get('/greets', function(req, res, next) {
    if ('expire' === req.query.error) {
        res.send('expire');
    } else  {
        res.send('greets')
    }
    
});

router.get('/greeting', function(req, res, next) {
    res.render('greetingCard');
});
module.exports = router;
