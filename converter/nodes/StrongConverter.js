'use strict';

/*
 * HTML converter for Blockquote.
 */
module.exports = {

  type: "strong",
  tagName: "bold",

  matchElement: function(el) {
    return el.is("b, strong", "bold");
  }
};
