import { Component } from 'substance'

function XMLEditor() {
  XMLEditor.super.apply(this, arguments);
}

XMLEditor.Prototype = function() {

  this.getXML = function() {
    return this.refs.xml.val();
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-xml-editor');

    el.append(
      $$('textarea')
        .ref('xml')
        .append(this.props.xml)
    );
    return el;
  };

};

Component.extend(XMLEditor);

export default XMLEditor;
