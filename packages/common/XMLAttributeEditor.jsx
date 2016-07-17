import map from 'lodash/map'
import Component from 'substance/ui/Component'

class XMLAttributeEditor extends Component {

  render($$) {
    var node = this.props.node
    var attributeStr = this._getAttributeString(node)
    return (
      <div class="sc-edit-xml-attributes">
        <textarea ref="attributesEditor">{attributeStr}</textarea>
      </div>
    )
  }

  /* Returns the changed attributes */
  getAttributes() {
    var attrStr = this.refs.attributesEditor.val()
    return this._parseAttributesFromString(attrStr)
  }

  _getAttributeString() {
    return map(this.props.attributes, function(val, key) {
      return key+'='+val
    }).join('\n')
  }

  _parseAttributesFromString(newAttrs) {
    newAttrs = newAttrs.split('\n')
    var res = {}

    newAttrs.forEach(function(attr) {
      var parts = attr.split('=')
      res[parts[0]] = parts[1]
    })
    return res
  }

}

export default XMLAttributeEditor
