window.SUBSTANCE_DEBUG_RENDERING = true;

var DocumentPage = require('../../ui/DocumentPage');
var Component = require('substance/ui/Component');

// Start the application
window.onload = function() {
  // DocumentPage loads the provided document url
  window.app = Component.mount(DocumentPage, {
    documentUrl: 'https://s3.amazonaws.com/elife-publishing-cdn/00007/elife-00007-v1.xml'
  }, document.body);
};
