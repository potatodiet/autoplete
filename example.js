"use strict";

let example = (function() {
  class CustomEasyComplete extends EasyComplete {
    constructor(input, config) {
      super(input, config);
      this.filter = this.ExactFilter;
    }
  }

  let input = document.getElementById("example");
  new CustomEasyComplete(input, {
    list: ["Java", "JavaScript", "Ruby"]
  });
})();

