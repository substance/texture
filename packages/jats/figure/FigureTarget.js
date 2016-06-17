'use strict';

var Component = require('substance/ui/Component');

/*
  Renders a keyboard-selectable figure target item
*/
function FigureTarget() {
  FigureTarget.super.apply(this, arguments);
}

FigureTarget.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-figure-target');
    // var node = this.props.node;

    el.append(
      $$('div').addClass('se-thumbnail').append(
        $$('img').attr({
          src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToBuZHn_DnrT_4-iXKVxApc5ZK0_0WH1b57LPle484-GLua_AqjKBLeis'
        })
      ),
      $$('div').addClass('se-label').append('FIG LABEL'),
      $$('div').addClass('se-title').append('FIG TITLE')
    );

    return el;
  };
};

Component.extend(FigureTarget);

module.exports = FigureTarget;