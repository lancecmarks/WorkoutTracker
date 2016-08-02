var handlers = {

  deactivateSubmit: function() {
    document.getElementById('workoutForm').submit(function(event){
      event.preventDefault();
      event.stopPropagation();
    });
  },

  deactivateButtons: function() {
    var buttonElements = document.getElementsByClassName('submitButton');

    for (var i = 0; i < buttonElements.length; i++) {

      var button = buttonElements[i];

      button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  },

  xhrSuccess : function() {
    this.callback.apply(this, this.arguments);
  },

  xhrError: function() {
    console.error(this.statusText);
  },

  loadFile: function(url, timeout, payload, fCallback /*, argumentToPass1, argumentToPass2, etc. */) {
    var args = arguments.slice(2);
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
      console.error('The request for ' + url + ' timed out.');
    };
    xhr.onload = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback.apply(xhr, args);
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.open('post',url,true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = timeout;
    xhr.send(JSON.stringify(payload));
  },

  clickAddEntry: function() {
      var body = {
        AddWorkout:'AddWorkout',
        name:null,
        reps:null,
        weight:null,
        date:null,
        scale:null
      };
      body.name = document.getElementById("entryName").value;
      body.reps = document.getElementById("entryReps").value;
      body.weight = document.getElementById("entryWeight").value;
      body.date = document.getElementById("entryDate").value;
      body.scale = document.getElementById("entryScale").value;
      
      this.loadFile('/', 2000, body, this.drawTable); 

  },


  drawTable: function() {
      //draw the table from the server response
      //append to the table as a new child row
      //in a loop for all rowa
      var workoutLog = JSON.parse(this.responseText);
      console.log('>>drawTableresponse: ',workoutLog);
      
      var workoutTable = document.getElementById("workoutTable");
      var workoutTableBody = document.getElementByID("workoutTableBody");
      workoutTable.removeChild(workoutTableBody);

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
        formButtonEditType.value = "button";
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
        formButtonDelete.textContent = "Delete";
        formDelete.appendChild(formButtonDelete);
        tableButtonCell.appendChild(formDelete);
        tableRowBody.appendChild(tableButtonCell);
        tableBody.appendChild(tableRowBody);
      }
  }

};




window.addEventListener('load', handlers.deactivateSubmit);
window.addEventListener('load', handlers.deactivateButtons);
