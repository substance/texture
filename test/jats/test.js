'use strict';

var test = require('substance/test/test');

var forEach = require('lodash/forEach');
var inBrowser = require('substance/util/inBrowser');
var oo = require('substance/util/oo');
var DOMElement = require('substance/ui/DOMElement');
var createJATSConfigurator = require('./createJATSConfigurator');

test = test.withExtension('withFixture', function(fixtureXML) {
  var tapeArgs = Array.prototype.slice.call(arguments, 1);
  var tapeish = this; // eslint-disable-line
  var t = tapeish.apply(tapeish, tapeArgs);
  t.fixture = new JATSFixture(fixtureXML);
  return t;
});

test = test.withExtension('attributesConversion', function(fixtureXML) {
  return test.withFixture(fixtureXML, 'Attributes should be converted.', function (t) {
    var el = t.fixture.xmlElement;
    var importer = t.fixture.createImporter();
    var caption = importer.convertElement(el);
    var attr = el.getAttributes();
    forEach(attr, function(val, key) {
      t.equal(caption.attributes[key], val, "Attribute '"+key+"' should have been imported.");
    });
    var exporter = t.fixture.createExporter();
    var newEl = exporter.convertNode(caption);
    var exportedAttr = newEl.getAttributes();
    forEach(attr, function(val, key) {
      t.equal(exportedAttr[key], val, "Attribute '"+key+"' should have been exported.");
    });
    t.end();
  });
});

function JATSFixture(fixtureXML) {
  this.configurator = createJATSConfigurator();
  this.xmlElement = DOMElement.parseXML(fixtureXML);
}

JATSFixture.Prototype = function() {

  this.createImporter = function() {
    var importer = this.configurator.createImporter('jats');
    importer.createDocument();
    return importer;
  };

  this.createExporter = function() {
    return this.configurator.createExporter('jats');
  };

};

oo.initClass(JATSFixture);

module.exports = test;
