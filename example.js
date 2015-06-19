"use strict";

let example = (function() {
  class CustomEasyComplete extends EasyComplete {
    constructor(input, config) {
      super(input, config);
    }

    filter(input, possibleMatch) {
      return possibleMatch.search(new RegExp(input)) !== -1;
    }
  }

  let input = document.getElementById("example");
  new CustomEasyComplete(input, {
    list: ["Java", "JavaScript", "Ruby"]
  });
})();

