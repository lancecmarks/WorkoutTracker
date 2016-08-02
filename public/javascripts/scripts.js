var handlers = {

  deactivateSubmit: function() {
    document.getElementByID('submitForm').submit(function(event){
      event.preventDefault();
      event.stopPropogation();
    }
  },

  deactivateButtons: function() {
    var buttonElements = document.getElementsByClassName('submitButton');

    for (var i = 0; i < buttonElements.length; i++) {

      var button = buttonElements[i];

      button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropogation();
      }
    }
  }


};




window.addEventListener('load', handlers.deactivateSubmit);
window.addEventListener('load', handlers.deactivateButtons);
