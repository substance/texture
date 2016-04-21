'use strict';

/*
 * HTML converter for Blockquote.
 */
module.exports = {

  type: "emphasis",
  tagName: "italic",

  matchElement: function(el) {
    return el.is("em, i", "italic");
  }

};
