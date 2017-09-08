import { Component } from 'substance'
import TextInput from './TextInput'
import { PUB_ID_TYPES, PUB_ID_TYPE_LABELS } from '../../constants'

export default class EditPubIdsComponent extends Component {
  render($$) {
    let elementCitation = this.props.node
    let publicationType = elementCitation.attr('publication-type')
    let el = $$('div').addClass('sc-edit-pubids')
    let pubIdTypes = PUB_ID_TYPES[publicationType]

    pubIdTypes.forEach((pubIdType) => {
      let pubId = elementCitation.find(`pub-id[pub-id-type=${pubIdType}]`)
      el.append(
        $$(TextInput, { node: pubId, label: PUB_ID_TYPE_LABELS[pubIdType] })
      )
    })
    return el
  }
}
