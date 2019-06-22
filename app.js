var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//Import routes for "catalog" area of site
var catalogRouter = require('./routes/catalog');
var compression = require('compression');  
var helmet = require('helmet');
var bcrypt = require('bcrypt-nodejs');
//for setup login system
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var app = express();
//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://swinghw:root1234@wing-0c4h3.mongodb.net/local_library?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());//compress all the following routes
app.use(express.static(path.join(__dirname, 'public')));
const User = require('./models/user');
app.use(session({ 
  secret: 'root4553',
  cookie: {maxAge:600000},
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
// initialize the passport module for login
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
  function (req, username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return done(err)
    }

    if (!user) {
      return done(null, false, req.flash('info', 'User not found.'))
    }

    var isValidPassword = function (user, password) {
      return bcrypt.compareSync(password, user.password)
    }

    if (!isValidPassword(user, password)) {
      return done(null, false, req.flash('info', 'Invalid password'))
    }

    return done(null, user)
  })
}
)); 
passport.use('signup', new LocalStrategy({
  passReqToCallback: true
}, function (req, username, password, done) {
  var findOrCreateUser = function () {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false, req.flash('info', 'User already exists'));
      } else {
        var newUser = new User();
        newUser.username = username;
        newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        newUser.email = req.params.email;
        newUser.save(function (err, user) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  };
  process.nextTick(findOrCreateUser)
}));
//set passport serialize and deserialize the user object
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
}); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Add catalog routes to middleware chain.
app.use('/catalog', catalogRouter);  


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;