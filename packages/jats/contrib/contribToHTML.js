'use strict';

var DOMElement = require('substance/ui/DefaultDOMElement');
var toDOM = require('../../../util/toDOM');

// TODO: this is partially a dup of refToHTML -> generalize
var namesToHTML = function (el) {
  var nameElements = el.findAll('name');
  var nameEls = [];
  var nameEl;
  for (var i = 0; i < nameElements.length; i++) {
    var name = nameElements[i];
    nameEl = DOMElement.createElement('span');
    nameEl.addClass('name');

    nameEl.text(name.find('surname').text() + ' ' + name.find('given-names').text());
    if (i > 0 && i < nameElements.length) {
      var comma = DOMElement.createElement('span');
      comma.text(', ');
      nameEls.push(comma);
    }
    nameEls.push(nameEl);
  }

  // Consider first string-name element if present
  var stringNameElement = el.find('string-name');
  if (stringNameElement) {
    nameEl = DOMElement.createElement('span').addClass('name');
    nameEl.text(stringNameElement.textContent);
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