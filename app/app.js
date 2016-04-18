'use strict';

var Component = require('substance/ui/Component');
var JATSImporter = require('../converter/JATSImporter');
var jQuery = require('substance/util/jquery');

function App() {
  App.super.apply(this, arguments);
}

App.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('substance-scientist');
    el.append('TODO');
    return el;
  };

};

Component.extend(App);

// TODO: do this properly like we do it in Notepad using routing and proper state handling

window.onload = function() {

  jQuery.ajax('/data/elife-00007.xml', {
    dataType: 'text'
  })
  .done(function(data){
    var importer = new JATSImporter();
    var doc = importer.importDocument(data);
    debugger;
    var body = window.document.body;
    Component.mount(App, {
      doc: doc
    }, body);
  })
  .fail(function(xhr, status, err) {
    console.error(err);
    throw new Error('Could not load document.');
  });

};

