import { Component, TextPropertyComponent } from 'substance'

export default
class HeadingComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-heading')
      .attr('data-id', node.id)

    const level = node.attributes['level']|| 1
    el.addClass('sm-level-'+level)

    // TODO: ability to edit attributes

    let title = node.get('title')
    if (title) {
      el.append($$(TextPropertyComponent, {
        path: title.getPath()
      }).ref('title'))
    }

    return el
  }

}

HeadingComponent.prototype._isCustomNodeComponent = true