var express = require('express');   //loads express
var app = express();                //creates express object

var handlebars = require("express-handlebars").create({defaultLayout:'main'});
var session = require('express-session');
var bodyparser = require('body-parser');  //load body parser for POST

app.use(express.static(__dirname + '/public'));  //serves up static files
app.use(bodyparser.urlencoded({extended: true}));  //true allows for nested array like syntax
app.use(bodyparser.json());                  //body parser now understands JSON
app.use(session({
  secret:'AppleGoatRainCow',
  resave: true,
  saveUninitialized: true
}));


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',2500);



app.get('/',function(req, res, next) {
  console.log('Inside the Get');
  var context = {};
  if(!req.session.logExists) {  //check if log exists, if not setup the structure
    req.session.logExists = 1;
    req.session.curId = 0;
    req.session.workoutLog = [];
  }
  context.logExists = req.session.logExists;
  context.curId = req.session.curId;
  context.workoutLog = req.session.workoutLog;
  console.log('Get Updated Context:');
  console.log(context);      
  res.render('home',context);
});

app.post('/',function(req, res){
  console.log('Inside the Post');
  if(req.body['AddWorkout']){
    console.log('Inside AddWorkout');
    req.session.workoutLog.push({"id":req.session.curId, "name":req.body.name, "reps":req.body.reps, "weight":req.body.weight,
    "date":req.body.date, "scale":req.body.scale});
  req.session.curId++;
  }

  if(req.body['DeleteWorkout']){
    console.log('Inside DeleteWorkout');
    req.session.workoutLog = req.session.workoutLog.filter(function(log){
      return log.id != req.body.id;
    })
  }

  //update context
  var context = {};
  context.logExists = req.session.logExists;
  context.curId = req.session.curId;
  context.workoutLog = req.session.workoutLog;
  console.log('Post Updated Context:');
  console.log(context);
  res.render('home',context);
});

/*
app.get('/count',function(req, res){       //this is the get request as in page load
  var context = {};
  context.count = req.session.count || 0;
  req.session.count = context.count + 1;
  res.render('counter', context);
});

app.post('/count', function(req, res){    //if a button is pushed, command is posted and changes rendered
  var context = {};
  if (req.body.command === "resentCount"){
    req.session.count = 0;
  } else {
    context.err = true;
  }
  context.count = req.session.count || 0;
  req.session.count = context.count + 1;
  res.render('counter', context);
});


*/

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err,req,res,next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
