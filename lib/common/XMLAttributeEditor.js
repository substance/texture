import map from 'lodash/map'
import { Component } from 'substance'

class XMLAttributeEditor extends Component {

  _getAttributeString() {
    return map(this.props.attributes, function(val, key) {
      return key+'='+val
    }).join('\n')
  }

  _parseAttributesFromString(newAttrs) {
    newAttrs = newAttrs.split('\n')
    let res = {}

    newAttrs.forEach(function(attr) {
      let parts = attr.split('=')
      res[parts[0]] = parts[1]
    })
    return res
  }

  /* Returns the changed attributes */
  getAttributes() {
    let attrStr = this.refs.attributesEditor.val()
    return this._parseAttributesFromString(attrStr)
  }

  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-xml-attribute-editor')
    let attributeStr = this._getAttributeString(node)
    el.append(
      $$('textarea')
        .ref('attributesEditor')
        .append(attributeStr)
    )
    return el
  }
}

export default XMLAttributeEditor
