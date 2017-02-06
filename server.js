var http = require('http')
   ,express = require('express')
   ,util=require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var gzipStatic = require('connect-gzip-static');


var port = 43210;
if(process.env.POLLINGEXPRESS_PORT) {
  port = process.env.POLLINGEXPRESS_PORT;
}

process.on('uncaughtException', function(err) {
  util.log('!! Uncaught exception ' + err.stack);
  util.log(err);
  process.exit(1);
});

var app = express();
app.use(session({
  secret : '168916146847864',
  resave : false,
  saveUninitialized : false,cookie: { maxAge: 600000 }
}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var userRouter = express.Router();

userRouter.use(function(req, res, next) {
  util.log('userRouter processing ' + req.method + ' request for ' + req.path);
  next();
});

userRouter.get('/:user_id',function(req,res){
  usersApi.identifyUserExt(req,res);
});
app.use('/u',userRouter);

var staticAssets = express.static('static');
var apiPath = '/api';
var settingsApi = require('./server/settings');
var usersApi = require('./server/users');
var pollApi = require('./server/poll');
var voteApi = require('./server/vote');
var resultsApi = require('./server/results');


var staticAssets = [
{ source:'static', target:'/' }
];


staticAssets.forEach(function(element) {
	console.log("Adding " + element.source + " under " + element.target);
	app.use(element.target,gzipStatic(element.source));	
});

var router = express.Router({});
router.use(function(req, res, next) {
  // util.log('router processing ' + req.method + ' request for ' + req.path);
  next();
});



router.get(apiPath, function(req, res) {
  res.json({
    message : 'Welcome to the api!'
  });
});

settingsApi.addRoutes(apiPath + '/settings', router);
usersApi.addRoutes(apiPath + '/users', router);
pollApi.addRoutes(apiPath + '/polls', router);
voteApi.addRoutes(apiPath + '/votes', router);
resultsApi.addRoutes(apiPath + '/results', router);

app.use('/app', router);

app.listen(port,function(){
	console.log("app listening on " + port );	
});







