import { forEach } from 'substance'
import { getText } from '../util/domHelpers'

/*
  <contrib contrib-type='group'> -> Group

  Used for group authors

  <!--
    Used for modelling group authors:

  <contrib contrib-type="group" equal-contrib="yes" corresp="no" deceased="no">
    <collab>
      <named-content content-type="name">The Mouse Genome Sequencing Consortium</named-content>
      <xref ref-type="aff" rid="aff2"/>
      <xref ref-type="award" rid="fund1" />
      <contrib-group contrib-type="group-member">
        <contrib contrib-type="person">
          <name>
            <surname>Kelly</surname><given-names>Laura A.</given-names>
          </name>
          <role>Writing Group</role>
          <xref ref-type="aff" rid="aff2"/>
        </contrib>
        <contrib contrib-type="person">
          <name>
            <surname>Randall</surname><given-names>Daniel Lee</given-names>
            <suffix>Jr.</suffix>
          </name>
          <role>Lab Group</role>
          <xref ref-type="aff" rid="aff3"/>
        </contrib>
      </contrib-group>
    </collab>
  </contrib>
  -->
*/

/*
  <name> -> { type: 'ref-contrib', name: 'Doe', givenNames: 'John }
  <collab>  -> { type: 'ref-contrib' name: 'International Business Machines' }

  Used within <ref>
*/
export const RefContribConverter = {

  import (el, pubMetaDb) {
    let node
    if (el.tagName === 'name') {
      node = {
        type: 'ref-contrib',
        givenNames: getText(el, 'given-names'),
        name: getText(el, 'surname')// ,
        // TODO: We may want to consider prefix postfix, and mix it into givenNames, or name properties
        // We don't want separate fields because this gets complex/annoying during editing
        // prefix: getText(el, 'prefix'),
        // suffix: getText(el, 'suffix'),
      }
    } else if (el.tagName === 'collab') {
      node = {
        type: 'ref-contrib',
        name: getText(el, 'named-content[content-type=name]')
      }
    } else {
      console.warn(`${el.tagName} not supported inside <person-group>`)
    }

    let entity = pubMetaDb.create(node)
    return entity.id
  },

  export ($$, node) {
    let el
    if (node.givenNames) {
      el = $$('name')
      el.append(_createTextElement($$, node.name, 'surname'))
      el.append(_createTextElement($$, node.givenNames, 'given-names'))
      // el.append(_createTextElement($$, record.prefix, 'prefix'))
      // el.append(_createTextElement($$, record.suffix, 'suffix'))
    } else if (node.name) {
      el = $$('collab')
      el.append(_createTextElement($$, node.name, 'named-content', { 'content-type': 'name' }))
    } else {
      console.warn('No content found for refContrib node')
    }
    return el
  }
}

let mappingItemTypes = {
  'journal': 'journal-article',
  'book': 'book',
  'chapter': 'chapter',
  'confproc': 'conference-paper',
  'data': 'data-publication',
  'patent': 'patent',
  'magazine': 'magazine-article',
  'newspaper': 'newspaper-article',
  'report': 'report',
  'software': 'software',
  'thesis': 'thesis',
  'webpage': 'webpage'
}

/*
  <element-citation ...>
*/
export const ElementCitationConverter = {

  export ($$, node, pubMetaDb) {
    let type = node.type
    let el = $$('element-citation').attr('publication-type', reverseMapping(mappingItemTypes)[type])

    // Regular properties
    if (node.assignee) {
      el.append(
        $$('collab').attr('collab-type', 'assignee').append(
          _createTextElement($$, node.assignee, 'named-content', { 'content-type': 'name' })
        )
      )
    }

    el.append(_createTextElement($$, node.confName, 'conf-name'))
    el.append(_createTextElement($$, node.confLoc, 'conf-loc'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.edition, 'edition'))
    el.append(_createTextElement($$, node.elocationId, 'elocation-id'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.issue, 'issue'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.pageCount, 'page-count'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    el.append(_createTextElement($$, node.partTitle, 'part-title'))
    el.append(_createTextElement($$, node.patentNumber, 'patent', { 'country': node.patentCountry }))
    el.append(_createMultipleTextElements($$, node.publisherLoc, 'publisher-loc'))
    el.append(_createMultipleTextElements($$, node.publisherName, 'publisher-name'))
    el.append(_createTextElement($$, node.uri, 'uri'))
    el.append(_createTextElement($$, node.version, 'version'))
    el.append(_createTextElement($$, node.volume, 'volume'))
    el.append(_createTextElement($$, node.year, 'year'))
    // identifiers
    el.append(_createTextElement($$, node.accessionId, 'pub-id', {'pub-id-type': 'accession'}))
    el.append(_createTextElement($$, node.arkId, 'pub-id', {'pub-id-type': 'ark'}))
    el.append(_createTextElement($$, node.archiveId, 'pub-id', {'pub-id-type': 'archive'}))
    el.append(_createTextElement($$, node.isbn, 'pub-id', {'pub-id-type': 'isbn'}))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    el.append(_createTextElement($$, node.pmid, 'pub-id', {'pub-id-type': 'pmid'}))
    // creators
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', pubMetaDb))
    el.append(_exportPersonGroup($$, node.inventors, 'inventor', pubMetaDb))
    el.append(_exportPersonGroup($$, node.sponsors, 'sponsor', pubMetaDb))

    if (type === 'book' || type === 'report' || type === 'software') {
      el.append(_createTextElement($$, node.title, 'source'))
    } else {
      el.append(_createTextElement($$, node.containerTitle, 'source'))
      if (type === 'chapter') {
        el.append(_createHTMLElement($$, node.title, 'chapter-title'))
      } else if (type === 'data') {
        el.append(_createHTMLElement($$, node.title, 'data-title'))
      } else {
        el.append(_createHTMLElement($$, node.title, 'article-title'))
      }
    }
    return el
  }
}

function _exportPersonGroup ($$, contribs, personGroupType, pubMetaDb) {
  if (contribs && contribs.length > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    contribs.forEach(refContribId => {
      let refContribNode = pubMetaDb.get(refContribId)
      el.append(
        RefContribConverter.export($$, refContribNode)
      )
    })
    return el
  }
}

function _getRefContribs (el, pubMetaDb, type) {
  let personGroup = el.find(`person-group[person-group-type=${type}]`)
  if (personGroup) {
    return personGroup.childNodes.map(el => {
      return RefContribConverter.import(el, pubMetaDb)
    })
  } else {
    return []
  }
}

function _getSeparatedText (rootEl, selector) {
  let match = rootEl.findAll(selector)
  if (match) {
    return match.map(m => { return m.textContent }).join('; ')
  } else {
    return ''
  }
}

function _getHTML (rootEl, selector) {
  let match = rootEl.find(selector)
  if (match) {
    return match.innerHTML
  } else {
    return ''
  }
}

function _getAttr (rootEl, selector, attr) {
  let match = rootEl.find(selector)
  if (match) {
    return match.attr(attr)
  } else {
    return ''
  }
}

function _createTextElement ($$, text, tagName, attrs) {
  if (text) {
    let el = $$(tagName).append(text)
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}

function _createMultipleTextElements ($$, text, tagName, attrs) {
  if (text) {
    const textItems = text.split(';')
    const elements = textItems.map(ti => {
      const el = $$(tagName).append(ti.trim())
      forEach(attrs, (value, key) => {
        el.attr(key, value)
      })
      return el
    })
    return elements
  }
}

function _createHTMLElement ($$, html, tagName, attrs) {
  if (html) {
    let el = $$(tagName)
    el.innerHTML = html
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}
