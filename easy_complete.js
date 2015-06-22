"use strict";

class EasyComplete {
  constructor(input, config) {
    this.input = input;
    this.matches = [];
    this.possibleMatches = [];
    this.activeMatch = null;

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

      this.setActiveMatch(this.matches[0]);
    }.bind(this));

    this.input.addEventListener("keydown", function keyOnInputPressed(ev) {
      switch (ev.keyCode) {
      case 13:
        this.selectMatch(this.findMatch());
        break;
      case 38:
        ev.preventDefault();
        this.traverseList(this.TraverseDirection.UP);
        break;
      case 40:
        ev.preventDefault();
        this.traverseList(this.TraverseDirection.DOWN);
        break;
      default:
        break;
      }
    }.bind(this));

    this.input.addEventListener("blur", function inputLostFocus(ev) {
      this.list.classList.remove("visible");
    }.bind(this));
    this.input.addEventListener("focus", function inputGainedFocus(ev) {
      this.list.classList.add("visible");
    }.bind(this));
  }

  // Converts a possible match into a real match.
  addMatch(match) {
    match.classList.add("visible");
    this.matches.push(match);
  }

  // Converts a real match back into a possible match.
  removeMatch(match) {
    match.classList.remove("visible");
    var index = this.matches.indexOf(match);
    if (index > -1) {
      this.matches.splice(index, 1);
    }
  }

  findMatch() {
    for (var i = 0, length = this.matches.length; i < length; ++i) {
      if (this.matches[i].classList.contains("active")) {
        return this.matches[i];
      }
    }
  }

  selectMatch(match) {
    this.input.value = match.innerText;
    this.clearList();
  }

  setupList(rawList) {
    var container = document.createElement("span");
    container.classList.add("easy_complete");
    this.input.parentNode.insertBefore(container, this.input);
    container.appendChild(this.input);

    this.list = document.createElement("ul");
    this.list.classList.add("visible");
    container.appendChild(this.list);

    var rawList = rawList || this.input.getAttribute("data-list").split(", ");
    this.possibleMatches.length = rawList.length;
    for (var i = 0, length = this.possibleMatches.length; i < length; ++i) {
      this.possibleMatches[i]  = document.createElement("li");
      this.possibleMatches[i].innerHTML = rawList[i];
      this.list.appendChild(this.possibleMatches[i]);
    }

    this.list.addEventListener("mouseover", function listHoverBegan(ev) {
      this.setActiveMatch(ev.target);
    }.bind(this));

    this.list.addEventListener("mousedown", function matchClicked(ev) {
      this.selectMatch(ev.target);
    }.bind(this));
  }

  clearList() {
    for (var i = this.matches.length - 1; i >= 0; --i) {
      this.removeMatch(this.matches[i]);
    }
    this.matches.length = 0;

    this.setActiveMatch(null);
  }

  setActiveMatch(match) {
    if (this.activeMatch) {
      this.activeMatch.classList.remove("active");
    }
    if (match) {
      match.classList.add("active");
      this.activeMatch = match;
    }
  }

  traverseList(direction) {
    switch (direction) {
    case this.TraverseDirection.UP:
      if (this.activeMatch.previousSibling) {
        this.setActiveMatch(this.activeMatch.previousSibling);
      }
      break;
    case this.TraverseDirection.DOWN:
      if (this.activeMatch.nextSibling) {
        this.setActiveMatch(this.activeMatch.nextSibling);
      }
      break;
    }
  }

  filter(input, possibleMatch) {
    return possibleMatch.search(new RegExp(input, "i")) !== -1;
  }
}

// I'm not sure how to properly define static variables.
EasyComplete.prototype.TraverseDirection = {
  UP: 0,
  DOWN: 1
}

// For some reason the self-executing function needs to be held in a variable.
// 'this' doesn't work unless it's held in a variable.
var easyCompleteInit = (function() {
  // Initialize all standard inputs.
  let inputs = document.getElementsByTagName("input");
  for (var i = 0, length = inputs.length; i < length; ++i) {
    if (inputs[i].getAttribute("data-list") !== null) {
      new EasyComplete(inputs[i]);
    }
  }
}());

