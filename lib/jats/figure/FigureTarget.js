import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

/*
  Renders a keyboard-selectable figure target item
*/
class FigureTarget extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()
    let el = $$('div')
      .addClass('sc-figure-target')
      .attr({'data-id': node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    // Render thumbnail
    el.append(
      this._renderThumb($$)
    )

    if (node.label) {
      let label = doc.get(node.label)
      el.append(
        renderNodeComponent(this, $$, label, {
          disabled: this.props.disabled
        })
      )
    }

    // Render first caption
    // TODO: Is there a way to cut off the caption to have a more compact view?
    let firstCaption = node.captions[0]

    if (firstCaption) {
      firstCaption = doc.get(firstCaption)
      el.append(
        renderNodeComponent(this, $$, firstCaption, {
          disabled: this.props.disabled
        })
      )
    }
    return el
  }

  /*
    Render thumbnail based on the contents of the figure
  */
  _renderThumb($$) {
    // For now we just pick the first content node (e.g. a graphic or a table)
    let node = this.props.node
    let doc = node.getDocument()
    let firstContentNode = node.contentNodes[0]
    let el = $$('div').addClass('se-thumbnail')

    if (firstContentNode) {
      firstContentNode = doc.get(firstContentNode)
      el.append(renderNodeComponent(this, $$, firstContentNode))
    } else {
      el.append('No thumb')
    }
    return el
  }
}

export default FigureTarget
