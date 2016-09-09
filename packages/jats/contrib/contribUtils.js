var toDOM = require('../../../util/toDOM');
var getFullName = require('../../../util/getFullName');
var getAffs = require('../aff/affUtils').getAffs;

/*
  For given contrib node get the assigned affiliation ids as an object
*/
function affsForContrib(node) {
  var el = toDOM(node);
  var xrefs = el.findAll('xref[ref-type=aff]');
  var affs = {};
  xrefs.forEach(function(xref) {
    var affId = xref.getAttribute('rid');
    affs[affId] = true;
  });
  return affs;
}

/*
  A practical view model for ContribComponent and EditContrib
*/
function getAdapter(node) {
  var doc = node.getDocument();

  return {
    node: node, // the original plain node
    fullName: getFullName(node),
    selectedAffs: affsForContrib(node),
    affs: getAffs(doc),
    // True if node follows strict texture-enforced markup
    strict: node.attributes.generator === 'texture'
  };
}

function saveContrib(documentSession, contribData) {
  documentSession.transaction(function(tx) {
    var node = tx.get(contribData.id);
    var el = toDOM(node);
    var $$ = el.getElementFactory();

    el.innerHTML = '';
    el.append(
      $$('string-name').append(contribData.fullName)
    );

    // Affiliations are represented as xrefs
    contribData.selectedAffs.forEach(function(affId) {
      el.append(
        $$('xref').attr({'ref-type': 'aff', rid: affId})
      );
    });

    var xmlContent = el.innerHTML;
    tx.set([node.id, 'xmlContent'], xmlContent);
  });
}

module.exports = {
  affsForContrib: affsForContrib,
  getAdapter: getAdapter,
  saveContrib: saveContrib
};