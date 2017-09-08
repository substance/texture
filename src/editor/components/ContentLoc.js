import { NodeComponent } from 'substance'
import TextInput from './TextInput'

const LABELS = {
  'print': 'Print',
  'electronic': 'Electronic'
}

export default class ContentLoc extends NodeComponent {

  didMount() {
    super.didMount()
    this.context.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id]})
  }

  dispose() {
    super.dispose()
    this.context.editorSession.off(this)
  }

  render($$) {
    let contentLoc = this.props.node
    let contentLocType = contentLoc.attr('type')
    let fpage = contentLoc.findChild('fpage')
    let lpage = contentLoc.findChild('lpage')
    let pageRange = contentLoc.findChild('page-range')
    let eLocationId = contentLoc.findChild('elocation-id')
    let el = $$('div').addClass('sc-content-loc')

    el.append(
      this._renderContentLocTypeSwitcher($$, contentLocType)
    )

    if (contentLocType === 'print') {
      el.append($$(TextInput, { node: fpage , label: 'First Page' }))
      el.append($$(TextInput, { node: lpage , label: 'Last page' }))
      el.append($$(TextInput, { node: pageRange , label: 'Page Range' }))
    } else if (contentLocType === 'electronic') {
      el.append($$(TextInput, { node: eLocationId , label: 'E-Location ID' }))
    }
    return el
  }

  _renderContentLocTypeSwitcher($$, contentLocType) {
    let el = $$('div').addClass('se-content-loc-type')
    let select = $$('select').on('change', this._onContentLocTypeChange).ref('contentLocType')
    let options = ['print', 'electronic']

    options.forEach((option) => {
      let optionEl = $$('option').attr('value', option).append(
        LABELS[option]
      )
      if (option === contentLocType) {
        optionEl.attr('selected', 'selected')
      }
      select.append(optionEl)
    })

    el.append(
      $$('div').addClass('se-label').append('Type'),
      $$('div').addClass('sg-select').append(select)
    )
    return el
  }

  _onContentLocTypeChange() {
    let contentLocId = this.props.node.id
    let newContentLocType = this.refs.contentLocType.val()
    this.context.editorSession.transaction((tx) => {
      let contentLoc = tx.get(contentLocId)
      contentLoc.attr('type', newContentLocType)
    })
  }
}
