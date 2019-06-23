var Account = require('../models/account');
var passport = require('passport'); 



exports.login_get = function (req,res) {  
  req.flash('info',"Please login correctly");
  res.render('login', {user: req.user, message: req.flash('info') });
}; 

exports.signup_post = function(req,res,next){
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
         
        return res.render('register', { message : err.message});
    }
    passport.authenticate('local')(req, res, function () {
        req.session.save(function(err){
          if(err){
            return next(err);
          }
          res.redirect('/catalog');    
        });        
    });
  });
  } 
 