"use strict";

function EasyComplete(input, config) {
  this.input = input;
  this.matches = [];
  this.possibleMatches = [];

  config = config || {};
  if (config["list"]) {
    this.setupList(config["list"]);
  } else {
    this.setupList();
  }

  this.input.addEventListener("input", function inputModified(ev) {
    this.clearList();
    
    if (!ev.srcElement.value) {
      return;
    }

    for (var i = 0, length = this.possibleMatches.length; i < length; ++i) {
      var entry = this.possibleMatches[i];
      if (this.filter(ev.srcElement.value, entry.innerText)) {
        this.addMatch(entry);
      }
    }
  }.bind(this));

  this.input.addEventListener("keydown", function keyOnInputPressed(ev) {
    switch (ev.keyCode) {
    case 13:
      self.selectMatch(this.findMatch());
      break;
    case 38:
      self.traverseList(this.TraverseDirection.UP);
      break;
    case 40:
      self.traverseList(this.TraverseDirection.DOWN);
      break;
    default:
      break;
    }
  }.bind(this));
}

EasyComplete.prototype = {
  // Converts a possible match into a real match.
  addMatch: function(match) {
    match.classList.add("visible");
    this.matches.push(match);
  },

  // Converts a real match back into a possible match.
  removeMatch: function(match) {
    match.classList.remove("visible");
    var index = this.matches.indexOf(match);
    if (index > -1) {
      this.matches.splice(index, 1);
    }
  },

  findMatch: function() {
    for (var i = 0, length = this.matches.length; i < length; ++i) {
      if (this.matches[i].classList.contains("active")) {
        return this.matches[i];
      }
    }
  },

  selectMatch: function(match) {
    this.input.value = match.innerText;
    this.clearList();
  },

  setupList: function(rawList) {
    var container = document.createElement("span");
    this.input.parentNode.insertBefore(container, this.input);
    container.appendChild(this.input);

    this.list = document.createElement("ul");
    this.list.classList.add("easy_complete");
    container.appendChild(this.list);

    var self = this;
    this.list.addEventListener("click", function matchClicked(ev) {
      self.selectMatch(self.findMatch());
    });

    var rawList = rawList || this.input.getAttribute("data-list").split(", ");
    this.possibleMatches.length = rawList.length;
    for (var i = 0, length = this.possibleMatches.length; i < length; ++i) {
      this.possibleMatches[i]  = document.createElement("li");
      this.possibleMatches[i].innerHTML = rawList[i];
      this.list.appendChild(this.possibleMatches[i]);
    }
  },

  clearList: function() {
    for (var i = this.matches.length - 1; i >= 0; --i) {
      this.removeMatch(this.matches[i]);
    }
    this.matches.length = 0;
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

  filter: function(input, possibleMatch) {
    return possibleMatch.search(new RegExp(input, "i")) !== -1;
  },

  mergeHash: function(first, second) {
    for (var key in second) {
      first[key] = second[key];
    }
  },

  TraverseDirection: {
    UP: 0,
    DOWN: 1
  }
}

// For some reason the self-executing function needs to be held in a variable.
// 'this' doesn't work unless it's held in a variable.
var easyCompleteInit = (function() {
  // Initialize all standard inputs.
  var inputs = document.getElementsByTagName("input");
  for (var i = 0, length = inputs.length; i < length; ++i) {
    if (inputs[i].getAttribute("data-list") !== null) {
      new EasyComplete(inputs[i]);
    }
  }
}());

