"use strict";

const example = (function() {
  class CustomAutoplete extends Autoplete {
    constructor(input, config) {
      super(input, config);
      this.filter = this.ExactFilter;
    }
  }

  let input = document.getElementById("example");
  new CustomAutoplete(input, {
    list: ["Java", "JavaScript", "Ruby"]
  });
})();

