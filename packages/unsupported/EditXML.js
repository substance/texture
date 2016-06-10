'use strict';

var Component = require('substance/ui/Component');

function EditXML() {
  Component.apply(this, arguments);
}

EditXML.Prototype = function() {

  this._save = function() {
    var newXML = this.refs.xml.val();
    var path = this.props.path;
    var documentSession = this.context.documentSession;

    documentSession.transaction(function(tx) {
      tx.set(path, newXML);
    });

    this.send('xmlSaved', newXML);
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-edit-xml');
    var documentSession = this.context.documentSession;
    var doc = documentSession.getDocument();
    var xml = doc.get(this.props.path);

    console.log('xmlval', xml);

    el.append(
      $$('textarea')
        .ref('xml')
        .append(xml)
    );

    el.append(
      $$('button').append('Save').on('click', this._save)
    );

    return el;
  };
};

Component.extend(EditXML);
module.exports = EditXML;

