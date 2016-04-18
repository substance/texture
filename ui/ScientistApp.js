'use strict';

var each = require('lodash/each');
var extend = require('lodash/extend');
var inBrowser = require('substance/util/inBrowser');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var Component = require('substance/ui/Component');
var DocumentPage = require('./DocumentPage');

var ScientistRouter = require('./ScientistRouter');

var I18n = require('substance/ui/i18n');
I18n.instance.load(require('../i18n/en'));

function Scientist() {
  ResponsiveApplication.apply(this, arguments);

  this.addPage('document', new DocumentPage());
}

Scientist.Prototype = function() {

  var _super = Scientist.super.prototype;

  this.getDefaultPage = function() {
    return 'document';
  };

  this.getRouter = function() {
    return new ScientistRouter(this);
  };

  this._isMobile = function() {
    if (inBrowser) {
      return window.innerWidth < 700;  
    }
  };

  this.getChildContext = function() {
    context = _super.getChildContext.call(this);
    return extend({}, context, {
      i18n: I18n.instance
    });
  };

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-scientist-app');
    this.renderPage($$);
  };
};

ResponsiveApplication.extend(Scientist);
module.exports = Scientist;