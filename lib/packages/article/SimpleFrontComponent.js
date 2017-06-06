import { Component } from 'substance'

/*
  Simplistic front-matter displaying title, abstract and authors
*/
export default class SimpleFrontComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div')
      .addClass('sc-front')
      .attr('data-id', node.id)

    // article-meta is mandatory
    const articleMeta = node.get('article-meta')

    // Title

    // title-group is optional
    const titleGroupEl = $$('div').addClass('sc-title-group')
    const titleGroup = articleMeta.get('title-group')
    if (titleGroup) {
      // article-title is mandatory
      const articleTitle = titleGroup.get('article-title')
      titleGroupEl.append($$(this.getComponent('text'), {
        node: articleTitle,
        disabled: this.props.disabled
      }))
    } else {
      titleGroupEl.append($$('div').text('No title'))
    }
    el.append(titleGroupEl)

    // Abstract

    // There can be multiple abstracts. We just take the first
    const abstract = articleMeta.get('abstract')
    const abstractContent = abstract.get('abstract-content')
    let abstractEl
    if (abstract && abstractContent) {
      abstractEl = $$(this.getComponent('container'), {
        node: abstractContent,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add an abstract
    }
    el.append(abstractEl)

    // Authors

    // TODO

    return el
  }
}
