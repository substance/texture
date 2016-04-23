'use strict';

var Component = require('substance/ui/Component');

function GraphicComponent() {
  Component.apply(this, arguments);
}

GraphicComponent.Prototype = function() {

  // TODO: find a generic way to resolve graphic urls
  this._resolveUrl = function(url) {
    url = 'http://publishing-cdn.elifesciences.org/00007/' + url;
    url = url.replace(/\.tif/, '.jpg');
    return url;
  };

  this.render = function($$) {
    var el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', this.props.node.id);
    el.append(
      $$('img').attr({
        src: this._resolveUrl(this.props.node.href)
      })
    );
    return el;
  };
};

Component.extend(GraphicComponent);

module.exports = GraphicComponent;