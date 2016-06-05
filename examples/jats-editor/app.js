window.SUBSTANCE_DEBUG_RENDERING = true;

var Scientist = require('../../packages/scientist/Scientist');
var ScientistConfigurator = require('../../packages/scientist/ScientistConfigurator');
var JATSEditorConfig = require('./JATSEditorConfig');

var configurator = new ScientistConfigurator();
configurator.import(JATSEditorConfig);

window.onload = function() {
  window.app = Scientist.static.mount({
    mode: 'write',
    documentId: 'elife-00007',
    configurator: configurator
  }, document.body);
};

