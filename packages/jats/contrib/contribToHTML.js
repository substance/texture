'use strict';

var DOMElement = require('substance/ui/DefaultDOMElement');

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
  // <xref ref-type="other" rid="par-1"/>
  // <xref ref-type="fn" rid="conf2"/>
  // <xref ref-type="fn" rid="con1"/>
  // <xref ref-type="other" rid="dataro1"/>
  // </contrib>

  contrib = DOMElement.parseXML('<contrib>'+contrib+'</contrib>');
  var el = DOMElement.createElement('div');
  var names = namesToHTML(contrib);
  for (var i = 0; i < names.length; i++) {
    el.appendChild(names[i]);
  }
  return el.outerHTML;
};

module.exports = contribToHTML;