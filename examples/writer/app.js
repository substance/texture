window.SUBSTANCE_DEBUG_RENDERING = true;

var DocumentPage = require('../../ui/DocumentPage');
var Component = require('substance/ui/Component');

// Start the application
window.onload = function() {
  // DocumentPage loads the provided document url
  var documentUrl = document.querySelector('meta[name=documentUrl').getAttribute('content');
  window.app = Component.mount(DocumentPage, {
    documentUrl: documentUrl
  }, document.body);
};
