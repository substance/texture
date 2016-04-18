'use strict';

var inBrowser = require('substance/util/inBrowser');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var Component = require('substance/ui/Component');
var cloneDeep = require('lodash/cloneDeep');

var I18n = require('substance/ui/i18n');
I18n.instance.load(require('../i18n/en'));

function ResponsiveApplication() {
  Component.apply(this, arguments);

  this.pages = {};

  this.handleActions({
    'navigate': this.navigate,
  });
}

ResponsiveApplication.Prototype = function() {

  this.getInitialState = function() {
    return {
      route: undefined,
      mobile: this._isMobile()
    };
  };

  this.didMount = function() {
    if (inBrowser) {
      var _window = DefaultDOMElement.getBrowserWindow();
      _window.on('resize', this._onResize, this);
    }
    var route = this.router.readRoute();
    // Replaces the current entry without creating new history entry
    // or triggering hashchange
    this.navigate(route, {replace: true});
  };

  this.dispose = function() {
    this.router.off(this);
  };

  /*
    Used to navigate the app based on given route.
  
    Example route: {documentId: 'example.xml'}
    On app level, never use setState/extendState directly as this may
    lead to invalid states.
  */
  this.navigate = function(route, opts) {
    this.extendState({
      route: route
    });
    this.router.writeRoute(route, opts);
  };

  this._onRouteChanged = function(route) {
    console.log('NotesApp._onRouteChanged', route);
    this.navigate(route, {replace: true});
  };

  this.didMount = function() {
    this.router.on('route:changed', this._onRouteChanged, this);
  };

  this._getPage = function() {
    return this.state.route.page || this.getDefaultPage();
  };

  this._getPageClass = function() {
    var page = this._getPage();
    return this.pages[page];
  };

  this._getPageProps = function() {
    var props = cloneDeep(this.state.route);
    delete props.page;
    props.mobile = this.state.mobile;
    return props;
  };

  this.addPage = function(pageName, PageClass) {
    this.pages[pageName] = PageClass;
  };

  this.renderPage = function($$) {
    var PageClass = this._getPageClass();

    return $$(PageClass, this._getPageProps());
  };

};

Component.extend(ResponsiveApplication);
module.exports = ResponsiveApplication;