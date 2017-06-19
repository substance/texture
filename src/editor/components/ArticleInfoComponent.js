import { NodeComponent } from 'substance'

/*
  Edit article information in this MetadataSection
*/
export default class ArticleInfoComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-article-info')

    let articleMeta = this.props.node
    let pubDate = articleMeta.findChild('pub-date')
    let volume = articleMeta.findChild('volume')
    let issue = articleMeta.findChild('issue')
    let fPage = articleMeta.findChild('fpage')
    let lPage = articleMeta.findChild('lpage')

    el.append(
      this._renderDateEditor($$, pubDate, 'Publication Date'),
      this._renderTextEditor($$, volume, 'Volume', 'number'),
      this._renderTextEditor($$, issue, 'Issue' ,'text'),
      this._renderTextEditor($$, fPage, 'First Page', 'number'),
      this._renderTextEditor($$, lPage, 'Last Page', 'number')
    )
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

  _renderDateEditor($$, metaEl, name) {
    let id = metaEl.id
    let value = metaEl.getAttribute('iso-8601-date')
    let el = $$('div').addClass('se-metadata-item').append(
      $$('div').addClass('se-label').append(name),
      $$('input').attr({type: 'date', value: value})
        .addClass('se-text-input')
        .ref(id)
        .on('change', this._updateDateProp.bind(this, metaEl))
    )

    return el
  }

  _updateTextProp(metaEl) {
    let id = metaEl.id
    let path = metaEl.getPath()
    let value = this.refs[id].val()
    let editorSession = this.context.editorSession
    editorSession.transaction(tx => {
      tx.set(path, value)
    })
  }

  _updateDateProp(metaEl) {
    let id = metaEl.id
    let value = this.refs[id].val()
    metaEl.setAttribute('iso-8601-date', value)
  }

}
