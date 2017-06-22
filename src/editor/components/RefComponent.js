import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class RefComponent extends Component {
  render($$) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('sc-ref')
    let ref = this.props.node
    let label = this.context.labelGenerator.getPosition('bibr', ref.id)

    let stringCitation = ref.find('string-citation')
    if (stringCitation) {
      el.append(
        $$('div').addClass('sc-string-citation').append(
          $$('div').addClass('se-label').append(
            label
          ),
          $$(TextPropertyEditor, {
            path: stringCitation.getTextPath(),
            disabled: this.props.disabled
          }),
          $$('span').addClass('se-remove-ref')
            .append(
              $$(Icon, { icon: 'fa-trash' }),
              'Remove reference'
            )
            .on('click', this._removeRef.bind(this, ref.id))
        )

      )
    } else {
      console.warn('No string citation found')
    }
    return el
  }

  _removeRef(refId) {
    // Here we must remove reference and all related xrefs
  }
}

