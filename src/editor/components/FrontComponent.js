import { Component } from 'substance'

/*
  Simplistic front-matter displaying title, abstract and authors
*/
export default class FrontComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div')
      .addClass('sc-front')
      .attr('data-id', node.id)

    // article-meta is mandatory
    const articleMeta = node.get('article-meta')

    // Title

    // title-group is optional
    const titleGroup = articleMeta.get('title-group')
    let titleGroupEl
    if (titleGroup) {
      titleGroupEl = $$(this.getComponent('title-group'), {
        node: titleGroup,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add a title
      titleGroupEl = $$('div').addClass('sc-title-group')
    }
    el.append(titleGroupEl)

    // Abstract

    // There can be multiple abstracts. We just take the first
    const abstract = articleMeta.get('abstract')
    let abstractEl
    if (abstract) {
      abstractEl = $$(this.getComponent('abstract'), {
        node: abstract,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add an abstract
      abstractEl = $$('div').addClass('sc-abstract')
    }
    el.append(abstractEl.ref('abstract'))

    // Authors

    // TODO

    return el
  }
}
