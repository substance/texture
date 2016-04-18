window.SUBSTANCE_DEBUG_RENDERING = true;

var ScientistApp = require('../ui/ScientistApp');
var Component = require('substance/ui/Component');

// Start the application
window.onload = function() {
  window.app = Component.mount(ScientistApp, document.body);
};
