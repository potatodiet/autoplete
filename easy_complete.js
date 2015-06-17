function EasyComplete(input) {
  this.input = input;

  this.setupList();

  this.list = input.nextSibling;

  // I should look into using bind with anonymous functions.
  var self = this;

  this.input.addEventListener("input", function inputModified(ev) {
    var matches = [];

    if (!ev.srcElement.value) {
      self.setMatches(matches);
      return;
    }
    
    var fullList = ev.srcElement.getAttribute("data-list").split(", ");
    for (var i = 0, length = fullList.length; i < length; ++i) {
      var entry = fullList[i];
      // Use RegExp for case-insensitive search.
      if (entry.search(new RegExp(ev.srcElement.value, "i")) !== -1) {
        matches.push(entry);
      }
    }

    self.setMatches(matches);
  });

  this.input.addEventListener("keydown", function keyOnInputPressed(ev) {
    switch (ev.keyCode) {
    case 13:
      self.selectMatch();
      break;
    case 38:
      self.traverseList(self.input.nextSibling, self.TraverseDirection.UP);
      break;
    case 40:
      self.traverseList(self.input.nextSibling, self.TraverseDirection.DOWN);
      break;
    default:
      break;
    }
  });
}

EasyComplete.prototype = {
  testing: function(test) {
    console.log(test);
  },

  // Resets the matched values for a input, then adds new matches.
  setMatches: function(matches) {
    var list = document.getElementsByTagName("ul")[0];

    this.clearList(list);

    // Add new matches.
    for (var i = 0, length = matches.length; i < length; ++i) {
      var element = document.createElement("li");
      element.appendChild(
        document.createTextNode(matches[i])
      );
      list.appendChild(element);

      var self = this;
      element.addEventListener("click", function matchClicked(ev) {
        self.input.value = ev.srcElement.innerText;
        self.clearList(list);
      });
    }
  },

  selectMatch: function() {
    this.input.value = this.list.getElementsByClassName("active")[0].innerText;
  },

  setupList: function() {
    var container = document.createElement("div");
    this.input.parentNode.insertBefore(container, this.input);
    container.appendChild(this.input);

    var list = document.createElement("ul");
    list.classList.add("easy_complete");
    container.appendChild(list);
  },

  clearList: function(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  },

  traverseList: function(list, direction) {
    var currentListItem = list.getElementsByClassName("active")[0];

    switch (direction) {
    case this.TraverseDirection.UP:
      if (currentListItem) {
        currentListItem.previousSibling.classList.add("active");
      } else {
        list.childNodes[list.childNodes.length - 1].classList.add("active");
      }
      break;
    case this.TraverseDirection.DOWN:
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
  },

  TraverseDirection: {
    UP: 0,
    DOWN: 1
  }
}

//(function() {
  // Initialize all standard inputs.
  var inputs = document.getElementsByTagName("input");
  for (var i = 0, length = inputs.length; i < length; ++i) {
    if (inputs[i].getAttribute("data-list") !== null) {
      new EasyComplete(inputs[i]);
    }
  }
//}());

