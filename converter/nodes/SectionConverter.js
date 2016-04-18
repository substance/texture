'use strict';

module.exports = {

  type: 'heading',
  tagName: 'sec',

  import: function(el, node, converter) {
    var state = converter.state;
    var currentLevel = state.getCurrentSectionLevel();
    var currentContainer = state.getCurrentContainer();
    state.increaseSectionLevel();
    node.level = currentLevel;
    el.getChildNodes().forEach(function(childEl) {
      var child = converter.convertElement(childEl);
      currentContainer.nodes.push(child.id);
    });
    state.decreaseSectionLevel();
  },

  export: function(node, el, converter) {
    converter.pushContainer(node);
    // consume all elements of the current container until
    // a heading is reached with level <= node.level
    converter.continue(function(childNode, childEl) {
      if (childNode.type === 'heading' && childNode.level <= node.level) {
        return false;
      }
      el.append(childEl);
    });
    converter.popContainer();
  }

};
