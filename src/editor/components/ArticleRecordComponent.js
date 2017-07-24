import { NodeComponent } from 'substance'

/*
  Edit article record in this MetadataSection
*/
export default class ArticleRecordComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-article-info')

    let articleMeta = this.props.node

    // TODO: if not present we need either a way to
    // add these or create and prune on Im-/Export
    let pubDate = articleMeta.findChild('pub-date')
    let volume = articleMeta.findChild('volume')
    let issue = articleMeta.findChild('issue')
    let fpage = articleMeta.findChild('fpage')
    let lpage = articleMeta.findChild('lpage')


    if (pubDate) {
      el.append(
        this._renderDateEditor($$, pubDate, 'Publication Date')
      )
    }
    if (volume) {
      el.append(
        this._renderTextEditor($$, volume, 'Volume', 'number')
      )
    }
    if (issue) {
      el.append(
        this._renderTextEditor($$, issue, 'Issue' ,'text')
      )
    }
    if (fpage) {
      el.append(
        this._renderTextEditor($$, fpage, 'First Page', 'number')
      )
    }
    if (lpage) {
      el.append(
        this._renderTextEditor($$, lpage, 'Last Page', 'number')
      )
    }
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
    editorSession.transaction(doc => {
      doc.set(path, value)
    })
  }

  _updateDateProp(metaEl) {
    let id = metaEl.id
    let value = this.refs[id].val()
    metaEl.setAttribute('iso-8601-date', value)
  }

}
