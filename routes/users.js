var express = require('express');
var router = express.Router(); 
var passport = require('passport');
var flash = require('connect-flash');
//Require user controller modules.
var user_controller = require('../controllers/userController');

//user Routes
router.get('/login',user_controller.login_get);
router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash:'login failure'}));
router.get('/logout', function(req, res) {
    req.flash('info','Bye, see you soon');
    req.logout();
    res.render('test', {user:req.user, message: req.flash('info')});
});
//stop register for unique user mode
//router.get('/register',user_controller.signup_get);
//router.post('/register',user_controller.signup_post);

module.exports = router;