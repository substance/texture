import { NodeComponent } from 'substance'
import MetadataSection from './MetadataSection'

/*
  Edit article information in this MetadataSection
*/
export default class ArticleInfoComponent extends NodeComponent {

  getInitialState() {
    return {
      expanded: true
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-article-info')

    el.append(
      $$(MetadataSection, {
        label: 'Article Information',
        expanded: this.state.expanded
      }).on('click', this._toggle)
    )

    if (this.state.expanded) {
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

      // let affs = doc.findAll('article-meta > aff-group > aff')
      // contribGroup.getChildren().forEach((contrib) => {
      //   el.append(
      //     $$('div').addClass('se-metadata-contributor').append(
      //       this._renderName($$, contrib),
      //       this._renderAffiliations($$, contrib, affs)
      //     )
      //   )
      // })
      // el.append(
      //   $$('button').addClass('se-metadata-contributor-add')
      //     .append('Add Contributor')
      //     .on('click', this._addContributor)
      // )
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
    editorSession.transaction(tx => {
      tx.set(path, value)
    })
  }

  _updateDateProp(metaEl) {
    let id = metaEl.id
    let value = this.refs[id].val()
    metaEl.setAttribute('iso-8601-date', value)
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

}
