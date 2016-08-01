var express = require('express');   //loads express
var app = express();                //creates express object

var handlebars = require("express-handlebars").create({defaultLayout:'main'});
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'student',
  password: 'default',
  database: 'student'
});
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
    pool.query('DROP TABLE IF EXISTS workoutLog', function(err){
      if(err){
        console.log('Error at Drop Table');
        next(err);
        return;
      }
      var createString = 'CREATE TABLE workoutLog(' +
        'id INT PRIMARY KEY AUTO_INCREMENT,' +
        'name VARCHAR(255) NOT NULL,' +
        'reps INT(11),' +
        'weight INT(11),' +
        'date DATE,' +
        'scale BOOLEAN)';
      pool.query(createString, function(err){
        if(err){
          console.log('Error at Create Table');
          next(err);
          return;
        }
        console.log('Table reset');
      })
    });
  }
  pool.query('SELECT * FROM workoutLog', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  context.workoutLog = JSON.stringify(rows);
  context.logExists = req.session.logExists;
  console.log('Get Updated Context:');
  console.log(context);      
  res.render('home',context);
});

app.post('/',function(req, res){
  console.log('Inside the Post');
  var context = {};
  //going to add new entry and then update context before render
  if(req.body['AddWorkout']){
    console.log('Inside AddWorkout');
    var values = [req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.scale];
    pool.query('Insert INTO workoutLog (`name`,`reps`,`weight`,`date`,`scale`) VALUES ?',[values], function(err, result){
      if(err){
        next(err);
        return;
      }
      pool.query('SELECT * FROM workoutLog', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.workoutLog = JSON.stringify(rows);
        console.log('Post Insert Updated Context:');
        console.log(context);      
        res.render('home',context);
      });
    });
  }
  //check for edit of workout
  if(req.body['EditWorkout']){
    console.log('Inside EditWorkout');
    var context = {};
    context.logExists = req.session.logExists;
    for (var log in req.session.workoutLog) {
      if (req.session.workoutLog.hasOwnProperty(log)){
        console.log('Log:');
        console.log(log)
        if (req.session.workoutLog[log].id===req.body.id){
          console.log('ID#:');
          console.log(req.session.workoutLog[log][i]);
          context[edit].name = req.session.workoutLog[log].name;
          context[edit].reps = req.session.workoutLog[log].reps;
          context[edit].weight = req.session.workoutLog[log].weight;
          context[edit].date = req.session.workoutLog[log].date;
          context[edit].scale = req.session.workoutLog[log].scale;
        }
      }
    }
    context.workoutLog = req.session.workoutLog;
    console.log('Entire log copied:');
    console.log(context);
    res.render('edit',context);
    return;
  }
  if(req.body['DeleteWorkout']){
    console.log('Inside DeleteWorkout');
    var idDelete = [req.body.id];
    pool.query('DELETE FROM workoutLog WHERE id =  ?',[idDelete], function(err, result){
      if(err){
        next(err);
        return;
      }
      pool.query('SELECT * FROM workoutLog', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.workoutLog = JSON.stringify(rows);
        console.log('Post Delete Updated Context:');
        console.log(context);      
        res.render('home',context);
      });
    });
  }
});

app.get('/reset-table', function(req, res, next){
  var context = {};
  pool.query('DROP TABLE IF EXISTS workoutLog', function(err){
    if(err){
      console.log('Error at Drop Table');
      next(err);
      return;
    }
    var createString = 'CREATE TABLE workoutLog(' +
      'id INT PRIMARY KEY AUTO_INCREMENT,' +
      'name VARCHAR(255) NOT NULL,' +
      'reps INT(11),' +
      'weight INT(11),' +
      'date DATE,' +
      'scale BOOLEAN)';
    pool.query(createString, function(err){
      if(err){
        console.log('Error at Create Table');
        next(err);
        return;
      }
      context.results = 'Table reset';
      res.render('home',context);
    });
  });
});

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




