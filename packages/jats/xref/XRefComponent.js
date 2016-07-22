import Component from 'substance/ui/Component'
import TextPropertyEditor from 'substance/ui/TextPropertyEditor'

class XRefComponent extends Component {
  render($$) {
    var node = this.props.node

    return (
      <span class={'sc-xref sm-'+node.referenceType}
        data-id={this.props.node.id}>
        <TextPropertyEditor
          disabled={this.props.disabled}
          tagName="span"
          path={[node.id, 'label']}
          withoutBreak={true}
          ref="labelEditor"
        />
      </span>
    )
  }
}

export default XRefComponent
