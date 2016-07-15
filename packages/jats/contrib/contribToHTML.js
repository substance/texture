'use strict';

var DOMElement = require('substance/ui/DefaultDOMElement');
var toDOM = require('../../../util/toDOM');

// TODO: this is dup of refToHTML -> generalize
var namesToHTML = function (el) {
  var nameElements = el.findAll('name');
  var nameEls = [];
  for (var i = 0; i < nameElements.length; i++) {
    var name = nameElements[i];
    var nameEl = DOMElement.createElement('span');
    nameEl.addClass('name');

    nameEl.text(name.find('surname').text() + ' ' + name.find('given-names').text());
    if (i > 0 && i < nameElements.length) {
      var comma = DOMElement.createElement('span');
      comma.text(', ');
      nameEls.push(comma);
    }
    nameEls.push(nameEl);
  }
  return nameEls;
};

var contribToHTML = function (contrib) {
  // <contrib contrib-type="author" id="author-1399">
  // <name>
  // <surname>Schuman</surname>
  // <given-names>Meredith C</given-names>
  // </name>
  // <xref ref-type="aff" rid="aff1"/>
  // </contrib>
  var contribEl = toDOM(contrib);

  var el = DOMElement.createElement('div');
  el.append(namesToHTML(contribEl));

  return el.outerHTML;
};

module.exports = contribToHTML;