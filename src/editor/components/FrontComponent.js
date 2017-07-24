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
    const articleMeta = node.findChild('article-meta')

    // Title

    // title-group is optional
    const titleGroup = articleMeta.findChild('title-group')
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

    // Authors and affiliations
    let authorsListEl = $$(this.getComponent('authors-list'), {
      node: node
    })
    el.append(authorsListEl)

    let affiliationsListEl = $$(this.getComponent('affiliations-list'), {
      node: node
    })
    el.append(affiliationsListEl)

    // Abstract

    // There can be multiple abstracts. We just take the first
    const abstract = articleMeta.findChild('abstract')
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

    return el
  }
}
