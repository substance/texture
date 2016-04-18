'use strict';

var extend = require('lodash/extend');
var DocumentPage = require('./DocumentPage');
var DashboardPage = require('./DashboardPage');
var ResponsiveApplication = require('./ResponsiveApplication');

var ScientistRouter = require('./ScientistRouter');

var I18n = require('substance/ui/i18n');
I18n.instance.load(require('../i18n/en'));

function Scientist() {
  ResponsiveApplication.apply(this, arguments);

  this.addPage('document', DocumentPage);
  this.addPage('dashboard', DashboardPage);
}

Scientist.Prototype = function() {

  var _super = Scientist.super.prototype;

  this.getDefaultPage = function() {
    return 'dashboard';
  };

  this.getRouter = function() {
    return new ScientistRouter(this);
  };

  this.getChildContext = function() {
    var context = _super.getChildContext.call(this);
    return extend({}, context, {
      i18n: I18n.instance
    });
  };

};

ResponsiveApplication.extend(Scientist);
module.exports = Scientist;