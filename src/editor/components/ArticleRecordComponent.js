import { NodeComponent } from 'substance'

import ContentLoc from './ContentLoc'
import TextInput from './TextInput'


const DATE_TYPES = {
  'accepted': 'Accepted',
  'corrected': 'Corrected',
  'pub': 'Published',
  'preprint': 'Preprint',
  'retracted': 'Retracted',
  'received': 'Received',
  'rev-recd': 'Revision Received',
  'rev-request': 'Revision Requested'
}

export default class ArticleRecordComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-article-record')

    let articleMeta = this.props.node
    let contentLoc = articleMeta.find('content-loc')
    let volume = articleMeta.findChild('volume')
    let issue = articleMeta.findChild('issue')

    el.append(
      $$(ContentLoc, { node: contentLoc })
    )

    if (volume) {
      el.append($$(TextInput, { node: volume , label: 'Volume'}))
    }
    if (issue) {
      el.append($$(TextInput, { node: issue , label: 'Issue'}))
    }

    el.append(
      this._renderHistory($$)
    )
    return el
  }

  _renderHistory($$) {
    let el = $$('div').addClass('se-history')
    let articleMeta = this.props.node
    let history = articleMeta.find('history')
    let dateTypes = Object.keys(DATE_TYPES)
    dateTypes.forEach((dateType) => {
      el.append(this._renderDateEditor($$, dateType, history))
    })
    return el
  }

  _renderTextEditor($$, metaEl, name, type) {
    let id = metaEl.id
    let value = metaEl.getText()
    let el = $$('div').addClass('se-metadata-item').append(
      $$('div').addClass('se-label').append(name),
      $$('input').attr({type: type, value: value})
        .addClass('se-text-input')
        .ref(id)
        .on('change', this._updateTextProp.bind(this, metaEl))
    )
    return el
  }

  _renderDateEditor($$, dateType, history) {
    let date = history.find(`date[date-type=${dateType}]`)
    let el = $$('div').addClass('se-date-item')

    if (date) {
      let dateFormat = date.attr('format') || 'standard'
      let year = date.find('year')
      let month = date.find('month')
      let day = date.find('day')
      let season = date.find('season')

      if (dateFormat === 'standard') {
        // year+month+day
        el.append(
          $$('div').addClass('se-label').append(DATE_TYPES[dateType]),
          $$('div').addClass('se-content').append(
            $$('input').attr({ type: 'text', value: year.getText(), placeholder: 'YYYY' })
              .ref(year.id)
              .on('change', this._updateTextProp.bind(this, year)),
            $$('input').attr({ type: 'text', value: month.getText(), placeholder: 'MM' })
              .ref(month.id)
              .on('change', this._updateTextProp.bind(this, month)),
            $$('input').attr({ type: 'text', value: day.getText(), placeholder: 'DD' })
              .ref(day.id)
              .on('change', this._updateTextProp.bind(this, day))
          )
        )
      } else if (dateFormat === 'seasonal') {
        // season+year
        el.append(
          $$('div').addClass('se-label').append(DATE_TYPES[dateType]),
          $$('div').addClass('se-content').append(
            $$('input').attr({ type: 'text', value: year.getText(), placeholder: 'YYYY' })
              .ref(year.id)
              .on('change', this._updateTextProp.bind(this, year)),
            $$('input').attr({ type: 'text', value: season.getText(), placeholder: 'Season' })
              .ref(season.id)
              .on('change', this._updateTextProp.bind(this, season))
          )
        )
      } else if (dateFormat === 'custom') {
        console.warn('string-date not yet supported')
      }
      return el
    } else {
      console.warn('date-type', dateType, 'not found in <history>')
    }

  }

  _updateTextProp(metaEl) {
    let id = metaEl.id
    let path = metaEl.getPath()
    let value = this.refs[id].val()
    let editorSession = this.context.editorSession
    editorSession.transaction(doc => {
      doc.set(path, value)
    })
  }

}
