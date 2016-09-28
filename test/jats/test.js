import { test } from 'substance-test'

import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import { DefaultDOMElement } from 'substance'
import createJATSConfigurator from './createJATSConfigurator'
import JATSImporter from '../../packages/jats/JATSImporter'

let _test = test.withExtension('withFixture', function(fixtureXML) {
  var tapeArgs = Array.prototype.slice.call(arguments, 1)
  var tapeish = this; // eslint-disable-line
  var t = tapeish.apply(tapeish, tapeArgs)
  t.fixture = new JATSFixture(fixtureXML)
  return t
})

_test = _test.withExtension('attributesConversion', function(fixtureXML, type) {
  return this.withFixture(fixtureXML, 'Attributes should be converted.', function (t) { // eslint-disable-line
    var el = t.fixture.xmlElement
    var importer = t.fixture.createImporter(type)
    var node = importer.convertElement(el)
    var attr = el.getAttributes()
    forEach(attr, function(val, key) {
      t.equal(node.attributes[key], val, "Attribute '"+key+"' should have been imported.")
    })
    var exporter = t.fixture.createExporter()
    var newEl = exporter.convertNode(node)
    t.ok(newEl.is(el.tagName), 'Exported element should be ' + el.tagName)
    var exportedAttr = newEl.getAttributes()
    forEach(attr, function(val, key) {
      t.equal(exportedAttr[key], val, "Attribute '"+key+"' should have been exported.")
    })
    t.end()
  })
})

export const module = _test.module

class JATSFixture {

  constructor(fixtureXML) {
    this.configurator = createJATSConfigurator()
    this.xmlElement = DefaultDOMElement.parseXML(fixtureXML)
  }

  createImporter(whiteList) {
    var config = {
      schema: this.configurator.getSchema(),
      DocumentClass: this.configurator.config.schema.ArticleClass
    }
    var converters = this.configurator.getConverterRegistry().get('jats')
    if (whiteList) {
      if (arguments.length > 1) {
        whiteList = Array.prototype.slice.call(arguments, 0)
      } else if (!isArray(whiteList)) {
        whiteList = [whiteList]
      }
      whiteList.push('unsupported')
      converters = converters.filter(function(entry, name) {
        return includes(whiteList, name)
      })
    }
    config.converters = converters
    var importer = new JATSImporter(config)
    importer.createDocument()
    return importer
  }

  createExporter() {
    return this.configurator.createExporter('jats')
  }

}

