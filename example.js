var example = (function() {
  function CustomEasyComplete(input, config) {
    EasyComplete.call(this, input, config);
  }
  CustomEasyComplete.prototype = Object.create(EasyComplete.prototype);
  CustomEasyComplete.constructor = CustomEasyComplete;
  CustomEasyComplete.prototype.filter = function(input, possibleMatch) {
    return possibleMatch.search(new RegExp(input)) !== -1;
  }

  var input = document.getElementById("example");
  new CustomEasyComplete(input, {
    list: ["Java", "JavaScript", "Ruby"]
  });
})();

