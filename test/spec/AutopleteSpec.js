"use strict";

describe("Autoplete", function() {
  let input = null;

  beforeEach(function() {
    let body = document.createElement("body");
    input = document.createElement("input");
    body.appendChild(input);
  });

  describe("with valid parameters", function() {
    let autoplete = null;
    const possibleMatches = ["Ruby", "JavaScript", "Java"];

    beforeEach(function() {
      input.setAttribute("data-list", possibleMatches.join(", "));
      autoplete = new Autoplete(input);
    });

    it("initializes a list of potential matches", function() {
      const rawPossibleMatches = input.nextSibling.childNodes;
      for (var i = 0, length = rawPossibleMatches.length; i < length; ++i) {
        const possibleMatch = rawPossibleMatches[i];
        expect(possibleMatch.tagName).toBe("LI");
        expect(possibleMatch.innerText).toBe(possibleMatches[i]);
      }
    });
  });
});

