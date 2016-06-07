'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function SectionComponent() {
  SectionComponent.super.apply(this, arguments);
}

SectionComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-section');

    el.append($$('div').addClass('se-bracket'));

    if (node.title) {
      el.append(
        $$(TextPropertyEditor, { path: [node.id, 'title'] }).ref('titleEditor')
          .addClass('se-title')
      );
    }

    el.append(
      $$(ContainerEditor, { node: node.contentAdapter }).ref('contentEditor')
        .addClass('se-content')
    );

    return el;
  };

};

Component.extend(SectionComponent);

SectionComponent.static.fullWidth = true;

module.exports = SectionComponent;
