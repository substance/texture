'use strict';

var Component = require('substance/ui/Component');
var contribToHTML = require('./contribToHTML');

function ContribComponent() {
  ContribComponent.super.apply(this, arguments);
}

ContribComponent.Prototype = function() {
  this.render = function($$) {
    var el = $$('div').addClass('sc-contrib');
    el.html(contribToHTML(this.props.node.xmlContent));
    return el;
  };
};

Component.extend(ContribComponent);

module.exports = ContribComponent;
