var substanceGlobals = require('substance/util/substanceGlobals');
var Scientist = require('../../packages/scientist/Scientist');
var ScientistConfigurator = require('../../packages/scientist/ScientistConfigurator');
var JATSEditorConfig = require('./JATSEditorConfig');

var configurator = new ScientistConfigurator();
configurator.import(JATSEditorConfig);

substanceGlobals.DEBUG_RENDERING = true;

window.onload = function() {
  window.app = Scientist.static.mount({
    mode: 'write',
    documentId: 'elife-00007',
    configurator: configurator
  }, document.body);
};

