var express = require('express');
var router = express.Router(); 
var passport = require('passport');

//Require user controller modules.
var user_controller = require('../controllers/userController');

//user Routes
router.get('/login',user_controller.login_get);
router.post('/login', passport.authenticate('login',{successRedirect:'/', failureRedirect:'/users/login'}));
router.get('/logout', function(req, res) {
    req.flash('info','Bye, see you soon');
    req.logout();
    res.render('test', {user:req.user, message: req.flash('info')});
});
//stop register for unique user mode
router.get('/register',user_controller.signup_get);
router.post('/register',passport.authenticate('signup',{ successRedirect: '/',
failureRedirect: '/users/register' }));

module.exports = router;