var Account = require('../models/account');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');


exports.login_get = function (req,res) {  
  req.flash('info',"Login please");
  res.render('login', {user: req.user, message: req.flash('info') });
};
exports.login_post = function(req,res,next){
  //main logic of passport authentication
  username = req.body.username;
  password = req.body.password;
  passport.use(new LocalStrategy({
    passReqToCallback:true}, 
    function(req, username, password, done){
      console.log(username);
      Account.findOne({username:username},function(err,user){
        if(err) {return done(err);}
        if(!user){
          return done(null, false, req.flash('info','user not found'))
        } 
        var isValidPassword = function(user, password){
          return bcrypt.compareSync(password, account.password)
        }
        if(!isValidPassword(user, password)){
          return done(null, false, req.flash('info', 'Invalid password'))
        }
        return done(null, user);
      })
    }));
    passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }); 
  };
exports.signup_get= function(req,res){
   req.flash('info', 'Signup, please');
   res.render('register',{message: req.flash('info')});
};

exports.signup_post = function(req,res,next){
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
        //req.flash('info','something wrong');
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
// console.log('the input of username and password ='+username,password);
  /*  User.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.flash('info', user.username+': User already exists');
        res.render('signup',{message:req.flash('info')});
      } else {
        var newUser = new User({username:username,password:bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)}); 
        newUser.save().then(doc =>{console.log(doc)}).catch(err =>{console.error(err)});
        res.redirect('/');  
      }
    });
    */