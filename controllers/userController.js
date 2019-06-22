  exports.login_get = function (req,res) {  
  req.flash('info',"Login please");
  res.render('login', {user: req.user, message: req.flash('info') });
}; 
exports.signup_get= function(req,res){
   req.flash('info', 'Signup, please');
   res.render('register',{message: req.flash('info')});
};