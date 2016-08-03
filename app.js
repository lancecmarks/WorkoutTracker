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
var session = require('express-session');  //used for tracking if new user
var bodyparser = require('body-parser');  //load body parser for POST

app.use(express.static(__dirname + '/public'));  //serves up static files
app.use(bodyparser.urlencoded({extended: true}));  //true allows for nested array like syntax
app.use(bodyparser.json());                  //body parser now understands JSON
app.use(session({
  secret:'AppleGoatRainCow',  //xkcd.com/936 
  resave: true,
  saveUninitialized: true
}));


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',2500);


/* -----------------------------------------------------------------
 * app.get() is used in the initial website load and the return from 
 * an Edit.  The application uses sessions to determine if the existing
 * table should be dropped and a new table created. There is also the 
 * reset table pathway below if desired but must manually be entered
 * ----------------------------------------------------------------*/
app.get('/',function(req, res, next) {
  var context = {};
  if(!req.session.logExists) {  //check if log exists, if not setup the structure
    req.session.logExists = 1;
    pool.query('DROP TABLE IF EXISTS workoutLog', function(err){
      if(err){
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
          next(err);
          return;
        }
      });
    });
  }
  pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date, '%Y-%m-%d') AS date, scale FROM workoutLog", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  var getRows = JSON.stringify(rows);
  context.workoutLog = JSON.parse(getRows);
  context.logExists = req.session.logExists;
  res.render('home',context);
  });
});


/* ----------------------------------------------------------------------
 * app.post() receives the post requests from the front end of the 
 * application.  There are several pathways inside the pipeline that are
 * checked for. Each call is asynchronous.
 * --------------------------------------------------------------------*/
app.post('/',function(req, res, next){
  var context = {};
  var stringRows;
  
/* ---------------------------------------
 * Add New Workout Entry
 * -------------------------------------*/
  if(req.body.AddWorkout){
    
    if (req.body.date===''){            //date error catch
      req.body.date=null;
    }
    
    var values = {name: req.body.name, reps: req.body.reps, weight: req.body.weight, date: req.body.date, 
      scale: req.body.scale};
    
    pool.query('Insert INTO workoutLog SET ?', values, function (err, result){
      if(err){
        next(err);
        return;
      }
      
      pool.query("SELECT id, name,reps,weight,DATE_FORMAT(date,'%Y-%m-%d') AS date, scale FROM workoutLog", function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        
        stringRows = JSON.stringify(rows); 
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end(stringRows);
      });
    });
  }

/* ---------------------------------------
 * Edit Workout Entry
 * -------------------------------------*/
  if(req.body.EditWorkout){
    
    var idEdit = [req.body.id];
    pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, scale FROM workoutLog WHERE id = ?",
        [idEdit], function(err, rows, fields){
      
      if(err){
        next(err);
        return;
      }

      var editRows = JSON.stringify(rows);
      context.editedLog = JSON.parse(editRows);
      res.render('edit',context);
    });
  }
    
/* ---------------------------------------
 * Update Edited Workout Entry
 * -------------------------------------*/
  if(req.body.ProcessWorkout){
    var idUpdate = [req.body.id];
    pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, scale FROM workoutLog WHERE id = ?",
        [idUpdate], function(err, rows, fields){
      
      if(err){
        next(err);
        return;
      }
      
      var curRows = JSON.stringify(rows);
      context.updatedLog = JSON.parse(curRows);
      
      if (req.body.date!==''){         //check for empty string in date
        context.updatedLog.date = req.body.date;  
      }
      
      pool.query('UPDATE workoutLog SET name=?, reps=?, weight=?, date=?, scale=? WHERE id = ?',
          [req.body.name || context.updatedLog.name, req.body.reps || context.updatedLog.reps,
          req.body.weight || context.updatedLog.weight, context.updatedLog.date,
          req.body.scale || context.updatedLog.scale, req.body.id], function(err, result){
            if(err){
              next(err);
              return;
            }
            
            pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, scale  FROM workoutLog", function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            
            var updatedRows = JSON.stringify(rows);
            context.workoutLog = JSON.parse(updatedRows);
            context.logExists = req.session.logExists;
            res.render('home',context);
            });
      });
    });
  }

/* ---------------------------------------
 * Delete Workout Entry
 * -------------------------------------*/
  if(req.body.DeleteWorkout){
    var idDelete = [req.body.id];
    
    pool.query('DELETE FROM workoutLog WHERE id =  ?',[idDelete], function(err, result){
      if(err){
        next(err);
        return;
      }
      
      pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, scale FROM workoutLog", function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        
        stringRows = JSON.stringify(rows);  //<------------OBJECT TO SEND BACK TO AJAX
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end(stringRows);
      });
    });
  }
});

/* -------------------------------------------------------------------
 * app.get(/reset-table) is included in case the user/grader would like
 * to clear the table manually instead of closing browser to remove
 * Session log. 
 * ------------------------------------------------------------------*/
app.get('/reset-table', function(req, res, next){
  var context = {};
  pool.query('DROP TABLE IF EXISTS workoutLog', function(err){
    if(err){
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
        next(err);
        return;
      }
      context.results = 'Table reset';
      res.render('home',context);
    });
  });
});

/* -------------------------------------------------------------------
 * Error handling at the bottom of the pipeline
 * -----------------------------------------------------------------*/
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

/* -------------------------------------------------------------------
 * Where the magic happens
 * ------------------------------------------------------------------*/
app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + ' or 52.41.83.28:2500 -  press Ctrl-C to terminate.');
});




