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
      });
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
});

app.post('/',function(req, res, next){
  console.log(req);
  console.log('Inside the Post');
  var context = {};
  //going to add new entry and then update context before render
  if(req.body.AddWorkout){
    console.log('Inside AddWorkout');
    var values = {name: req.body.name, reps: req.body.reps, weight: req.body.weight, date: req.body.date, 
      scale: req.body.scale};
    pool.query('Insert INTO workoutLog SET ?', values, function (err, result){
      if(err){
        next(err);
        return;
      }
      console.log(result);
      pool.query('SELECT * FROM workoutLog', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        console.log('>>rows: ',rows);
        var stringRows = JSON.stringify(rows);  //<------------OBJECT TO SEND BACK TO AJAX
        console.log('>> stringRows: ', stringRows);
        console.log('Post Insert Updated Context:');
        res.writeHead(200,{'Content-Type': 'text/plain'});
        console.log("MESSAGE SENT BACK BY SERVER!!");
        res.end(stringRows);
      });
    });
  }
  //check for edit of workout
  if(req.body.EditWorkout){
    console.log('Inside EditWorkout');
    var idEdit = [req.body.id];
    pool.query('SELECT * FROM workoutLog WHERE id = ?',[idEdit], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      console.log('>>Urows: ',rows);
      var editRows = JSON.stringify(rows);
      console.log('>> editRows: ', editRows);
      context.editedLog = JSON.parse(editRows);
      console.log('Post Update Updated Context:');
      console.log(context);      
      res.render('edit',context);
    });
  }
    
  //check Update for values
  if(req.body.ProcessWorkout){
    var idUpdate = [req.body.id];
    console.log('Inside ProcessWorkout');
    pool.query('SELECT * FROM workoutLog WHERE id = ?',[idUpdate], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      console.log('>>Urows: ',rows);
      var curRows = JSON.stringify(rows);
      console.log('>> curRows: ', curRows);
      context.updatedLog = JSON.parse(curRows);
      console.log('>> updatedLog: ', context);
      pool.query('UPDATE workoutLog SET name=?, reps=?, weight=?, date=?, scale=? WHERE id = ?',
          [req.body.name || context.updatedLog.name, req.body.reps || context.updatedLog.reps,
          req.body.weight || context.updatedLog.weight, !!req.body.date || context.updatedLog.date,
          req.body.scale || context.updatedLog.scale, req.body.id], function(err, result){
            if(err){
              next(err);
              return;
            }
            pool.query('SELECT * FROM workoutLog', function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            console.log('>>rows: ',rows);
            curRows = JSON.stringify(rows);
            console.log('>> curUSRows: ', curRows);
            context.workoutLog = JSON.parse(curRows);
            console.log('Post Update Updated Context:');
            console.log(context);      
            res.render('home',context);
            });
      });
    });
  }

  //check Delete
  if(req.body.DeleteWorkout){
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
        console.log('>>rows: ',rows);
        var stringRows = JSON.stringify(rows);
        console.log('>> stringRows: ', stringRows);
        context.workoutLog = JSON.parse(stringRows);
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




