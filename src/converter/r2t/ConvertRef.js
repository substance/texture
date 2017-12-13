class EntityConverter {
  getText(rootEl, selector) {
    let match = rootEl.find(selector)
    if (match) {
      return match.textContent
    } else {
      return ''
    }
  }

  /*
    Converts annotated JATS into HTML string.

    Only basic annotations allowed (em, strong, sub, sup).
  */
  getHTML(rootEl, selector) {
    // TOOD: implement
  }
}

class CitationConverter extends EntityConverter {
  getEntityId(el) {
    return this.getText(el, 'pub-id[pub-id-type=entity]')
  }

  /*
    Converts person-group element into person records and returns list of ids
  */
  convertPersons(el, selector, entityDb) {
    // TODO implement
  }
}

class JournalArticleConverter {
  import(el, entityDb) {
    let entityId = this.getEntityId(el)
    if (!entityId) {
      // We need
      let node = {
        type: 'journal-article',
        year: this.getText(el, 'year'),
        month: this.getText(el, 'month'),
        day: this.getText(el, 'day'),
        authors: this.convertPersons(el, 'author', entityDb),
        editors: this.convertPersons(el, 'editor', entityDb),
        articleTitle: this.getHTML(el, 'articleTitle'),
        source: this.getText(el, 'source'),
        volume: this.getText(el, 'volume'),
        fpage: this.getText(el, 'fpage'),
        lpage: this.getText(el, 'lpage'),
        pageRange: this.getText(el, 'page-range'),
      }
      entityId = entityDb.create(node).id
    }
    return entityId
  }
}

/*
  We convert <ref> elements into entities
*/
export default class ConvertRef {
  import(dom, api) {
    let refs = dom.findAll('ref')
    const entityDb = api.entityDb

    refs.forEach((refEl) => {
      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation> inside <ref>')
      } else {
        let converter
        switch(elementCitation.attr('publication-type')) {
          case 'journal':
            converter = new JournalArticleConverter()
            break;
          default:
            throw new Error('publication type not found.')
        }
        let entityId = converter.import(elementCitation, entityDb)
        refEl.attr('rid', entityId)
        refEl.empty()
      }
    })
  }

  export(/*dom, api*/) {
  }
}
