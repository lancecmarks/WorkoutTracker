var handlers = {


/* -------------------------------------------------------------
 * loadFile() takes a url input as string, a payload input as
 * Javascript object, and a callback function.  It creates
 * a new XMLHttpRequest and asynchronously makes a POST
 * passing the callback for the response.
 * -----------------------------------------------------------*/
  loadFile: function(url, payload, callback) {

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load',function(){
      if(xhr.status>=200&&xhr.status<400){
        console.log("STATUS IS A GO!");
        var response = JSON.parse(xhr.responseText);
        console.log("CALLING DRAWTABLE WITH: ",response);
        callback(response);
      } else {
        console.log("Error in network request: " + request.statusText);
      }
    });
    xhr.open('post',url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(payload));
  },

/* -----------------------------------------------------------
 * clickAddEntry() takes no input, uses DOM search to find
 * needed values to update Javascript object before calling
 * the loadFile function. It also verifies a name was entered
 * for the workout.
 * ----------------------------------------------------------*/
  clickAddEntry: function() {

      var body = {
        AddWorkout:null,
        name:null,
        reps:null,
        weight:null,
        date:null,
        scale:null
      };
      body.AddWorkout = document.getElementById("entryButton").value;
      body.name = document.getElementById("entryName").value;
      body.reps = document.getElementById("entryReps").value;
      body.weight = document.getElementById("entryWeight").value;
      body.date = document.getElementById("entryDate").value;
      body.scale = document.getElementById("entryScale").value;
      
      if (body.name!==''){
        console.log("Workout Name Not Empty");
        this.loadFile('/', body, this.drawTable); 
      }

  },

/* -------------------------------------------------------------
 * clickDeleteEntry()  takes input from row and updates a 
 * Javascript object before calling the loadFile function
 * -----------------------------------------------------------*/
  clickDeleteEntry: function(item) {

    var body = {
      DeleteWorkout: "DeleteWorkout",
      id: null
    };
    body.id  = item;

    this.loadFile('/', body, this.drawTable);
  },


/* --------------------------------------------------------------
 * drawTable() takes a serverResponse object in the form of an 
 * array of objects.  It creates the necessary html elements
 * for displaying the array of objects and then attaches the
 * table body to the table in the layout.
 * ------------------------------------------------------------*/
  drawTable: function(serverResponse) {

      var workoutLog = serverResponse;
      
      //the anchor everything will be attached to
      var workoutTable = document.getElementById("workoutTable");
      
      //create item to check for old table and delete before new
      var workoutTableBody = document.getElementById("workoutTableBody");
      if (workoutTableBody.id == "workoutTableBody"){
        workoutTable.removeChild(workoutTableBody);
      }

      var tableBody = document.createElement("tbody");
      var tableBodyID = document.createAttribute("id");
      tableBodyID.value = "workoutTableBody";
      tableBody.setAttributeNode(tableBodyID);

      for (var i = 0; i<workoutLog.length; i++) {
        var tableRowBody = document.createElement("tr");
        
        var tableNameCell = document.createElement("td");
        tableNameCell.textContent = workoutLog[i].name;
        tableRowBody.appendChild(tableNameCell);
        
        var tableRepsCell = document.createElement("td");
        tableRepsCell.textContent = workoutLog[i].reps;
        tableRowBody.appendChild(tableRepsCell);
        
        var tableWeightCell = document.createElement("td");
        tableWeightCell.textContent = workoutLog[i].weight;
        tableRowBody.appendChild(tableWeightCell);
        
        var tableDateCell = document.createElement("td");
        tableDateCell.textContent = workoutLog[i].date;
        tableRowBody.appendChild(tableDateCell);
        
        var tableScaleCell = document.createElement("td");
        tableScaleCell.textContent = workoutLog[i].scale;
        tableRowBody.appendChild(tableScaleCell);
        
        //create tablecell for buttons
        var tableButtonCell = document.createElement("td");
        
        //create edit form
        var formEdit = document.createElement("form");
        var formEditAction = document.createAttribute("action");
        formEditAction.value = "/";
        formEdit.setAttributeNode(formEditAction);
        var formEditMethod = document.createAttribute("method");
        formEditMethod.value = "post";
        formEdit.setAttributeNode(formEditMethod);
        
        //create edit hidden input and attach
        var formInputEdit = document.createElement("input");
        var formInputEditType = document.createAttribute("type");
        formInputEditType.value = "hidden";
        formInputEdit.setAttributeNode(formInputEditType);
        var formInputEditName = document.createAttribute("name");
        formInputEditName.value = "id";
        formInputEdit.setAttributeNode(formInputEditName);
        var formInputEditValue = document.createAttribute("value");
        formInputEditValue.value = workoutLog[i].id;
        formInputEdit.setAttributeNode(formInputEditValue);
        formEdit.appendChild(formInputEdit);
        
        //create edit button and attach
        var formButtonEdit = document.createElement("button");
        var formButtonEditType = document.createAttribute("type");
        formButtonEditType.value = "submit";
        formButtonEdit.setAttributeNode(formButtonEditType);
        var formButtonEditName = document.createAttribute("name");
        formButtonEditName.value = "EditWorkout";
        formButtonEdit.setAttributeNode(formButtonEditName);
        var formButtonEditValue = document.createAttribute("value");
        formButtonEditValue.value = "EditWorkout"; 
        formButtonEdit.setAttributeNode(formButtonEditValue);
        var formButtonEditClass = document.createAttribute("class");
        formButtonEditClass.value = "submitButton";
        formButtonEdit.setAttributeNode(formButtonEditClass);
        formButtonEdit.textContent = "Edit";
        formEdit.appendChild(formButtonEdit);
        tableButtonCell.appendChild(formEdit);
        
        //create delete form
        var formDelete = document.createElement("form");
        var formDeleteAction = document.createAttribute("action");
        formDeleteAction.value = "/";
        formDelete.setAttributeNode(formDeleteAction);
        var formDeleteMethod = document.createAttribute("method");
        formDeleteMethod.value = "post";
        formDelete.setAttributeNode(formDeleteMethod);
        
        //create delete hidden input and attach
        var formInputDelete = document.createElement("input");
        var formInputDeleteType = document.createAttribute("type");
        formInputDeleteType.value = "hidden";
        formInputDelete.setAttributeNode(formInputDeleteType);
        var formInputDeleteName = document.createAttribute("name");
        formInputDeleteName.value = "id";
        formInputDelete.setAttributeNode(formInputDeleteName);
        var formInputDeleteValue = document.createAttribute("value");
        formInputDeleteValue.value = workoutLog[i].id;
        formInputDelete.setAttributeNode(formInputDeleteValue);
        formDelete.appendChild(formInputDelete);
        
        //create delete button and attach
        var formButtonDelete = document.createElement("button");
        var formButtonDeleteType = document.createAttribute("type");
        formButtonDeleteType.value = "button";
        formButtonDelete.setAttributeNode(formButtonDeleteType);
        var formButtonDeleteName = document.createAttribute("name");
        formButtonDeleteName.value = "DeleteWorkout";
        formButtonDelete.setAttributeNode(formButtonDeleteName);
        var formButtonDeleteValue = document.createAttribute("value");
        formButtonDeleteValue.value = "DeleteWorkout"; 
        formButtonDelete.setAttributeNode(formButtonDeleteValue);
        var formButtonDeleteClass = document.createAttribute("class");
        formButtonDeleteClass.value = "submitButton";
        formButtonDelete.setAttributeNode(formButtonDeleteClass);
        var formButtonDeleteOnClick = document.createAttribute("onclick");
        formButtonDeleteOnClick.value = "handlers.clickDeleteEntry(" + workoutLog[i].id + ")";
        formButtonDelete.setAttributeNode(formButtonDeleteOnClick);
        formButtonDelete.textContent = "Delete";
        formDelete.appendChild(formButtonDelete);
        
        //attach button cell to tr then entire row to table body
        tableButtonCell.appendChild(formDelete);
        tableRowBody.appendChild(tableButtonCell);
        tableBody.appendChild(tableRowBody);
      }

      //attach the table body to the table
      workoutTable.appendChild(tableBody);
  }

};


