var handlers = {

  xhrSuccess : function() {
    this.callback.apply(this, this.arguments);
  },

  xhrError: function() {
    console.error(this.statusText);
  },

  loadFile: function(url, payload, callback /*, argumentToPass1, argumentToPass2, etc. */) {
    console.log("I WAS CLICKED");
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
      
      this.loadFile('/', body, this.drawTable); 

  },

  clickDeleteEntry: function(item) {
    var body = {
      DeleteWorkout: "DeleteWorkout",
      id: null
    };
    body.id  = item;

    this.loadFile('/', body, this.drawTable);
  },

  drawTable: function(serverResponse) {
      //draw the table from the server response
      //append to the table as a new child row
      //in a loop for all rowa
      var workoutLog = serverResponse;
      console.log('>>drawTableresponse: ',workoutLog);
      
      var workoutTable = document.getElementById("workoutTable");
      var workoutTableBody = document.getElementById("workoutTableBody");
      if (workoutTableBody.id == "workoutTableBody"){
        console.log('Old Table Removed');
        workoutTable.removeChild(workoutTableBody);
      }

      var tableBody = document.createElement("tbody");
      var tableBodyID = document.createAttribute("id");
      tableBodyID.value = "workoutTableBody";
      tableBody.setAttributeNode(tableBodyID);

      for (var i = 0; i<workoutLog.length; i++) {
        console.log("In loop the for time: ",i);
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
        
        var tableButtonCell = document.createElement("td");
        
        var formEdit = document.createElement("form");
        var formEditAction = document.createAttribute("action");
        formEditAction.value = "/";
        formEdit.setAttributeNode(formEditAction);
        var formEditMethod = document.createAttribute("method");
        formEditMethod.value = "post";
        formEdit.setAttributeNode(formEditMethod);
        
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
        
        var formButtonEdit = document.createElement("button");
        var formButtonEditType = document.createAttribute("type");
        formButtonEditType.value = "submit";
        formButtonEdit.setAttributeNode(formButtonEditType);
        var formButtonEditName = document.createAttribute("name");
        formButtonEditName.value = "EditWorkout";
        formButtonEdit.setAttributeNode(formButtonEditName);
        var formButtonEditValue = document.createAttribute("value");
        formButtonEditValue.value = "EditWorkout";                        //<----------- MIGHT BE A GOOD PLACE TO PASS ID VALUE;
        formButtonEdit.setAttributeNode(formButtonEditValue);
        var formButtonEditClass = document.createAttribute("class");
        formButtonEditClass.value = "submitButton";
        formButtonEdit.setAttributeNode(formButtonEditClass);
        formButtonEdit.textContent = "Edit";
        formEdit.appendChild(formButtonEdit);
        tableButtonCell.appendChild(formEdit);
        
        var formDelete = document.createElement("form");
        var formDeleteAction = document.createAttribute("action");
        formDeleteAction.value = "/";
        formDelete.setAttributeNode(formDeleteAction);
        var formDeleteMethod = document.createAttribute("method");
        formDeleteMethod.value = "post";
        formDelete.setAttributeNode(formDeleteMethod);
        
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
        
        var formButtonDelete = document.createElement("button");
        var formButtonDeleteType = document.createAttribute("type");
        formButtonDeleteType.value = "button";
        formButtonDelete.setAttributeNode(formButtonDeleteType);
        var formButtonDeleteName = document.createAttribute("name");
        formButtonDeleteName.value = "DeleteWorkout";
        formButtonDelete.setAttributeNode(formButtonDeleteName);
        var formButtonDeleteValue = document.createAttribute("value");
        formButtonDeleteValue.value = "DeleteWorkout";                        //<----------- MIGHT BE A GOOD PLACE TO PASS ID VALUE;
        formButtonDelete.setAttributeNode(formButtonDeleteValue);
        var formButtonDeleteClass = document.createAttribute("class");
        formButtonDeleteClass.value = "submitButton";
        formButtonDelete.setAttributeNode(formButtonDeleteClass);
        var formButtonDeleteOnClick = document.createAttribute("onclick");
        formButtonDeleteOnClick.value = "handlers.clickDeleteEntry(" + workoutLog[i].id + ")";
        formButtonDelete.setAttributeNode(formButtonDeleteOnClick);
        formButtonDelete.textContent = "Delete";
        formDelete.appendChild(formButtonDelete);
        tableButtonCell.appendChild(formDelete);
        tableRowBody.appendChild(tableButtonCell);
        tableBody.appendChild(tableRowBody);
      }
      workoutTable.appendChild(tableBody);
  }

};


