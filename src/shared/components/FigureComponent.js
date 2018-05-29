import { NodeComponent } from 'substance'
// import { getLabel } from '../util/nodeHelpers'

export default class FigComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-figure').append('TODO_FIGURE_COMP')
    return el
  }

//   render($$) {
//     const node = this.props.node
//     let el = $$('div')
//       .addClass('sc-'+node.type)
//       .attr('data-id', node.id)

//     let label = getLabel(node)
//     let labelEl = $$('div').addClass('se-label').text(label)
//     el.append(labelEl)

//     const figType = this._getContentType()
//     const content = node.findChild(figType)
//     let contentEl
//     if (content) {
//       contentEl = $$(this.getComponent(figType), {
//         node: content,
//         disabled: this.props.disabled
//       })
//       el.append(contentEl.ref('content'))
//     }

//     const title = node.findChild('title')
//     let titleEl = $$(this.getComponent('text-property-editor'), {
//       placeholder: 'Enter Title',
//       path: title.getPath(),
//       disabled: this.props.disabled
//     }).addClass('se-title').ref('title')
//     el.append(titleEl)

//     const caption = node.findChild('caption')
//     let captionEl
//     if (caption) {
//       captionEl = $$(this.getComponent('caption'), {
//         node: caption,
//         disabled: this.props.disabled
//       })
//     }
//     el.append(captionEl.ref('caption'))
//     return el
//   }

//   _getContentType() {
//     switch(this.props.node.type) {
//       case 'table-wrap': {
//         return 'table'
//       }
//       default: return 'graphic'
//     }
//   }
}
