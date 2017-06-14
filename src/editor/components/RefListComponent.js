import { NodeComponent } from 'substance'

class RefListComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()
    let el = $$('div').addClass('sc-ref-list')

    // NOTE: We don't yet expose RefList.label to the editor
    let title = node.find('title')
    if (title) {
      el.append(
        $$('div').addClass('sm-title').append(
          $$(this.getComponent('text-property-editor'), {
            path: title.getTextPath(),
            disabled: this.props.disabled
          })
        )
      )
    }

    let refs = node.findAll('ref')
    refs.forEach((ref) => {
      let RefComponent = this.getComponent('ref')
      el.append(
        $$(RefComponent, {
          node: ref
        })
      )
    })
    return el
  }
}

// Isolated Nodes config
RefListComponent.fullWidth = true
RefListComponent.noStyle = true

export default RefListComponent
