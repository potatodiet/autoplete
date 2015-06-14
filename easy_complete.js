(function() {
  var inputs = getInputs();

  setupLists(inputs);

  inputs.forEach(function(input) {
    input.addEventListener("input", function(ev) {
      var matches = [];
      
      var fullList = ev.srcElement.getAttribute("data-list").split(", ");
      fullList.forEach(function(entry) {
        // Use RegExp for case-insensitive search.
        if (entry.search(new RegExp(ev.srcElement.value, "i")) !== -1) {
          matches.push(entry);
        }
      });

      setMatches(matches, input);
    });
  });
  
  // Returns all inputs which contain a data-list attribute.
  function getInputs() {
    var matchedInputs = [];

    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; ++i) {
      //console.log(input);
      if (inputs[i].getAttribute("data-list") !== null) {
        matchedInputs.push(inputs[i]);
      }
    };

    return matchedInputs;
  }

  // Resets the matched values for a input, then adds new matches.
  function setMatches(matches, input) {
    var list = document.getElementsByTagName("ul")[0];

    // Reset list.
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    // Add new matches.
    matches.forEach(function(match) {
      var element = document.createElement("li");
      element.appendChild(
        document.createTextNode(match)
      );
      list.appendChild(element);
    });
  }

  function setupLists(inputs) {
    inputs.forEach(function(input) {
      var container = document.createElement("div");
      input.parentNode.insertBefore(container, input);
      container.appendChild(input);
      container.appendChild(
        document.createElement("ul")
      );
    });
  }
}());

