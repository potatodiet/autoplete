var example = (function() {
  var input = document.getElementById("example");
  new EasyComplete(input, {
    filter: function(input, possibleMatch) {
      return possibleMatch.search(new RegExp(input)) !== -1;
    },
    list: ["Java", "JavaScript", "Ruby"]
  });
})();

