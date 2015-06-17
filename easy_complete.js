function EasyComplete(input) {
  this.input = input;

  this.setupList();

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
      self.traverseList(self.TraverseDirection.UP);
      break;
    case 40:
      self.traverseList(self.TraverseDirection.DOWN);
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
  setMatches: function(matchesAsText) {
    this.clearList();
    this.matches.length = matchesAsText.length;

    // Add new matches.
    for (var i = 0, length = this.matches.length; i < length; ++i) {
      var match = document.createElement("li");
      match.innerHTML = matchesAsText[i];
      this.list.appendChild(match);

      var self = this;
      match.addEventListener("click", function matchClicked(ev) {
        self.input.value = ev.srcElement.innerText;
        self.clearList();
      });

      this.matches[i] = match;
    }
  },

  selectMatch: function() {
    for (var i = 0, length = this.matches.length; i < length; ++i) {
      if (this.matches[i].classList.contains("active")) {
        this.input.value = this.matches[i].innerText;
        break;
      }
    }
  },

  setupList: function() {
    var container = document.createElement("div");
    this.input.parentNode.insertBefore(container, this.input);
    container.appendChild(this.input);

    this.list = document.createElement("ul");
    this.list.classList.add("easy_complete");
    container.appendChild(this.list);
  },

  clearList: function() {
    for (var i = 0, length = this.matches.length; i < length; ++i) {
      this.list.removeChild(this.matches[i]);
    }
    while (this.matches.length > 0) {
      this.matches.pop();
    }
  },

  traverseList: function(direction) {
    var currentListItem = this.list.getElementsByClassName("active")[0];

    switch (direction) {
    case this.TraverseDirection.UP:
      if (currentListItem) {
        currentListItem.previousSibling.classList.add("active");
      } else {
        this.list.childNodes[this.list.childNodes.length - 1].classList.add("active");
      }
      break;
    case this.TraverseDirection.DOWN:
      if (currentListItem) {
        currentListItem.nextSibling.classList.add("active");
      } else {
        this.list.childNodes[0].classList.add("active");
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
  },

  matches: []
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

