'use strict';

import { Component } from 'substance'
import refToHTML from './refToHTML'


function RefComponent() {
  RefComponent.super.apply(this, arguments);
}

RefComponent.Prototype = function() {
  this.render = function($$) {
    var el = $$('div').addClass('sc-ref');
    el.html(refToHTML(this.props.node));
    return el;
  };
};

Component.extend(RefComponent);

// Isolated Nodes config
RefComponent.fullWidth = true;
RefComponent.noStyle = true;

export default RefComponent;
