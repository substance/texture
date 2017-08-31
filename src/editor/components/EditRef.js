import { Component } from 'substance'
import JournalCitation from './JournalCitation'
import BookCitation from './BookCitation'


const refTypes = [
  {id: 'journal', label: 'Journal article'},
  {id: 'book', label: 'Book chapter'},
]

export default class EditRef extends Component {

  didMount() {
    let elementCitation = this.props.node.find('element-citation')
    this.context.editorSession.onRender('document', this.rerender, this, {
      path: [ elementCitation.id, 'attributes', 'publication-type' ]
    })
  }

  /*
    TODO:
      - Implement missing ref types (schema + converters + components)
  */
  render($$) {
    let elementCitation = this.props.node.find('element-citation')
    let publicationType = elementCitation.getAttribute('publication-type')
    let el = $$('div').addClass('sc-edit-ref')

    el.append(
      this._renderRefTypeSwitcher($$)
    )

    if(publicationType === 'journal') {
      el.append($$(JournalCitation, { node: elementCitation }))
    } else if (publicationType === 'book') {
      el.append($$(BookCitation, { node: elementCitation }))
    } else {
      el.append(`Editing of the publication type ${publicationType} is not yet supported in this Alpha version.`)
    }
    return el
  }

  _renderRefTypeSwitcher($$) {
    let elementCitation = this.props.node.find('element-citation')
    let publicationType = elementCitation.getAttribute('publication-type')
    let el = $$('div').addClass('se-ref-type')

    let switcher = $$('select').on('change', this._onRefTypeChange).ref('refType')
    refTypes.forEach(refType => {
      let option = $$('option').attr('value', refType.id).append(refType.label)
      if(publicationType === refType.id) option.attr('selected', 'selected')
      switcher.append(option)
    })
    el.append(
      $$('div').addClass('se-label').append('Type'),
      $$('div').addClass('se-select').append(switcher)
    )
    return el
  }

  _onRefTypeChange() {
    const elementCitationId = this.props.node.find('element-citation').id
    const refType = this.refs.refType.val()
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let elementCitation = doc.get(elementCitationId)
      elementCitation.setAttribute('publication-type', refType)
    })
  }


}
