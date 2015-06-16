(function() {
  var inputs = getInputs();
  setupLists(inputs);

  for (var inputsIt = 0, inputsLength = inputs.length;
       inputsIt < inputsLength; ++inputsIt) {
    var input = inputs[inputsIt];

    input.addEventListener("input", function inputModified(ev) {
      var matches = [];

      if (!ev.srcElement.value) {
        setMatches(matches, input);
        return;
      }
      
      var fullList = ev.srcElement.getAttribute("data-list").split(", ");
      for (var fullListIt = 0, fullListLength = fullList.length;
           fullListIt < fullListLength; ++fullListIt) {
        var entry = fullList[fullListIt];
        // Use RegExp for case-insensitive search.
        if (entry.search(new RegExp(ev.srcElement.value, "i")) !== -1) {
          matches.push(entry);
        }
      }

      setMatches(matches, input);
    });

    input.addEventListener("keydown", function keyOnInputPressed(ev) {
      if (ev.keyCode === 38) {
        traverseList(input.nextSibling, TraverseDirection.UP);
      } else if (ev.keyCode === 40) {
        traverseList(input.nextSibling, TraverseDirection.DOWN);
      }
    });
  }
  
  // Returns all inputs which contain a data-list attribute.
  function getInputs() {
    var matchedInputs = [];

    var inputs = document.getElementsByTagName("input");
    for (var i = 0, length = inputs.length; i < length; ++i) {
      var input = inputs[i];
      if (inputs[i].getAttribute("data-list") !== null) {
        matchedInputs.push(inputs[i]);
      }
    }

    return matchedInputs;
  }

  // Resets the matched values for a input, then adds new matches.
  function setMatches(matches, input) {
    var list = document.getElementsByTagName("ul")[0];

    clearList(list);

    // Add new matches.
    for (var i = 0, length = matches.length; i < length; ++i) {
      var match = matches[i];
      var element = document.createElement("li");
      element.appendChild(
        document.createTextNode(match)
      );
      list.appendChild(element);

      element.addEventListener("click", function matchClicked(ev) {
        input.value = element.innerHTML;
        clearList(list);
      });
    }
  }

  function setupLists(inputs) {
    inputs.forEach(function(input) {
      var container = document.createElement("div");
      input.parentNode.insertBefore(container, input);
      container.appendChild(input);

      var list = document.createElement("ul");
      list.classList.add("easy_complete");
      container.appendChild(list);
    });
  }

  function clearList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  function traverseList(list, direction) {
    var currentListItem = list.getElementsByClassName("active")[0];

    switch (direction) {
    case TraverseDirection.UP:
      if (currentListItem) {
        currentListItem.previousSibling.classList.add("active");
      } else {
        list.childNodes[list.childNodes.length - 1].classList.add("active");
      }
      break;
    case TraverseDirection.DOWN:
      if (currentListItem) {
        currentListItem.nextSibling.classList.add("active");
      } else {
        list.childNodes[0].classList.add("active");
      }
      break;
    }

    if (currentListItem) {
      currentListItem.classList.remove("active");
    }
  }

  TraverseDirection = {
    UP: 0,
    DOWN: 1
  }
}());

