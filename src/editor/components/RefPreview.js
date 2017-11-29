import RefComponent from './RefComponent'

export default class RefPreview extends RefComponent {

  render($$) {
    let el = super.render($$)
    // HACK: should use attr('class') or el.className after substance/substance#1136 is fixed
    // this is VirtualElements internal storage
    el.classNames = ['sc-ref-preview']

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    return el
  }
}
