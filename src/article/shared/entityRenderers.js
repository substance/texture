import { DefaultDOMElement } from 'substance'

function journalArticleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }

  // We render an annotated article title here:
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  if (entity.editors.length > 0) {
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.editors, entityDb),
      '.'
    )
  }
  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }

  let date = _renderDate($$, entity.year, entity.month, entity.day, 'short')
  if (date) {
    fragments.push(' ', date, ';')
  }

  if (entity.volume) {
    fragments.push(entity.volume)
  }
  if (entity.issue) {
    fragments.push('(', entity.issue, ')')
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  if (entity.pmid) {
    fragments.push(' PMID ', entity.pmid)
  }
  return fragments
}

function bookRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  } else if (entity.editors.length > 0) {
    let editorLabel = entity.editors.length > 1 ? 'eds' : 'ed'
    fragments = fragments.concat(
      _renderAuthors($$, entity.editors, entityDb),
      ', ',
      editorLabel,
      '.'
    )
  }
  if (entity.translators.length) {
    fragments = fragments.concat(
      ' (',
      _renderAuthors($$, entity.translators, entityDb),
      ', trans).'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      $$('i').append(entity.title),
      '.'
    )
  }
  if (entity.volume) {
    if (/^\d+$/.test(entity.volume)) {
      fragments.push(' Vol ', entity.volume, '.')
    } else {
      fragments.push(' ', entity.volume, '.')
    }
  }
  if (entity.edition) {
    fragments.push(' ', entity.edition, '.')
  }
  if (entity.editors.length > 0 && entity.authors.length > 0) {
    let editorLabel = entity.editors.length > 1 ? 'eds' : 'ed'
    fragments = fragments.concat(
      ' (',
      _renderAuthors($$, entity.editors, entityDb),
      ', ',
      editorLabel,
      ').'
    )
  }

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  if (entity.series) {
    fragments.push(' (', entity.series, ')')
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }
  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }
  return fragments
}

function chapterRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.translators.length) {
    fragments = fragments.concat(
      ' (',
      _renderAuthors($$, entity.translators, entityDb),
      ', trans).'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  fragments = fragments.concat('In: ')
  if (entity.editors.length > 0) {
    let editorLabel = entity.editors.length > 1 ? 'eds' : 'ed'
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.editors, entityDb),
      ', ',
      editorLabel,
      '.'
    )
  }
  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(
        entity.containerTitle
      ),
      '.'
    )
  }
  if (entity.volume) {
    if (/^\d+$/.test(entity.volume)) {
      fragments.push(' ', entity.volume, '.')
    } else {
      fragments.push(' Vol ', entity.volume, '.')
    }
  }
  if (entity.edition) {
    fragments.push(' ', entity.edition, '.')
  }

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  if (entity.series) {
    fragments.push(' (', entity.series, ')')
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }
  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }
  return fragments
}

function patentRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.inventors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.inventors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.assignee) {
    fragments.push(' ', entity.assignee, ',')
  }
  let date = _renderDate($$, entity.year, entity.month, entity.day, 'short')
  if (date) {
    fragments.push(' ', date, ';')
  }
  if (entity.patentNumber) {
    fragments.push(' ', entity.patentNumber)
  }
  if (entity.patentCountry) {
    fragments.push(' (', entity.patentCountry, ').')
  }
  return fragments
}

function articleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  // We render an annotated article title here:
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }

  if (entity.editors.length > 0) {
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.editors, entityDb),
      '.'
    )
  }
  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }

  let date = _renderDate($$, entity.year, entity.month, entity.day, 'short')
  if (date) {
    fragments.push(' ', date, ';')
  }

  if (entity.issue) {
    fragments.push('(', entity.issue, ')')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  if (entity.pmid) {
    fragments.push(' PMID ', entity.pmid)
  }
  return fragments
}

function dataPublicationRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      '.'
    )
  }
  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
    fragments.push('.')
  }
  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }
  if (entity.arkId) {
    fragments.push(' ', entity.arkId)
  }
  if (entity.archiveId) {
    fragments.push(' ', entity.archiveId)
  }
  if (entity.accessionId) {
    fragments.push(' ', entity.accessionId)
  }
  return fragments
}

function magazineArticleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      ','
    )
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

function newspaperArticleRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(
      ' ',
      $$('i').append(entity.containerTitle),
      ','
    )
    if (entity.edition) {
      fragments.push(
        ' ',
        $$('i').append(entity.edition),
        ','
      )
    }
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(':', contentLocation)
  }
  if (entity.partTitle) {
    fragments.push(' (', entity.partTitle, ')')
  }
  fragments.push('.')

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

function reportRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []
  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '. '
    )
  }

  if (entity.sponsors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.sponsors, entityDb),
      ', sponsors. '
    )
  }

  if (entity.title) {
    fragments.push(
      $$('i').append(entity.title),
      '.'
    )
  }

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  if (entity.series) {
    fragments.push(' (', entity.series, ')')
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

function conferencePaperRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.containerTitle) {
    fragments.push(' ', $$('i').append(entity.containerTitle), '.')
  }

  if (entity.confName && entity.confLoc) {
    fragments.push(' ', entity.confName, '; ', entity.confLoc, '.')
  } else if (entity.confName) {
    fragments.push(' ', entity.confName, '.')
  } else if (entity.confLoc) {
    fragments.push(' ', entity.confLoc, '.')
  }

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
  }

  let contentLocation = _renderLocation($$, entity.fpage, entity.lpage, entity.pageRange, entity.elocationId)
  if (contentLocation) {
    fragments.push(', ', contentLocation, '.')
  } else {
    fragments.push('.')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }
  return fragments
}

function softwareRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      ' ',
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '.'
    )
  }
  if (entity.version) {
    fragments.push(' Version ', entity.version)
  }
  fragments.push('.')

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  let date = _renderDate($$, entity.year, entity.month, entity.day, 'short')
  if (date) {
    fragments.push(' ', date, ';')
  }

  if (entity.doi) {
    fragments.push(
      ' ',
      _renderDOI($$, entity.doi)
    )
  }

  return fragments
}

function thesisRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  fragments.push(_renderPublisherPlace($$, entity.publisherLoc, entity.publisherName))

  if (entity.year) {
    fragments.push(' ', entity.year)
    if (entity.month) {
      fragments.push(' ', _renderMonth(entity.month, 'short'))
    }
    fragments.push('.')
  }

  return fragments
}

function webpageRenderer ($$, entityId, entityDb, exporter) {
  let entity = entityDb.get(entityId)
  let fragments = []

  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb),
      '.'
    )
  }
  if (entity.title) {
    fragments.push(
      ' ',
      ...exporter.annotatedText([entity.id, 'title'], entityDb, $$),
      '. '
    )
  }

  if (entity.publisherLoc) {
    fragments.push(' ', entity.publisherLoc)
  }

  if (entity.uri) {
    fragments.push(
      ' ',
      $$('a').attr({
        href: entity.uri,
        target: '_blank'
      }).append(
        entity.uri
      )
    )
  }

  if (entity.year) {
    let dateFormatted = _renderDate($$, entity.year, entity.month, entity.day, 'long')
    fragments.push('. Accessed ', dateFormatted, '.')
  }

  return fragments
}

/* This is used for authors and editors */
function personRenderer ($$, entityId, entityDb, options = {}) {
  let { prefix, suffix, givenNames, surname } = entityDb.get(entityId)
  if (options.short) {
    givenNames = _getInitials(givenNames)
  }
  let result = []
  if (prefix) {
    result.push(prefix, ' ')
  }
  result.push(
    givenNames,
    ' ',
    surname
  )
  if (suffix) {
    result.push(' (', suffix, ')')
  }
  return result
}

function groupRenderer ($$, entityId, entityDb) {
  let { name } = entityDb.get(entityId)
  return [ name ]
}

// function personRenderer($$, entityId, entityDb, options = {}) {
//   let { prefix, suffix, givenNames, surname } = entityDb.get(entityId)
function refContribRenderer ($$, entityId, entityDb, options = {}) {
  let { givenNames, name } = entityDb.get(entityId)

  let result = [
    name
  ]

  if (givenNames) {
    if (options.short) {
      givenNames = _getInitials(givenNames)
    }

    result.push(
      ' ',
      givenNames
    )
  }
  return result
}

function organisationRenderer ($$, entityId, entityDb, options = {}) {
  let org = entityDb.get(entityId)
  return org.render(options)
}

function funderRenderer ($$, entityId, entityDb, options = {}) {
  let { awardId, institution } = entityDb.get(entityId)
  let result = [ institution ]
  if (!options.short) {
    if (awardId) {
      result.push(', ', awardId)
    }
  }
  return result
}

function keywordRenderer ($$, entityId, entityDb, options = {}) {
  let { category, name } = entityDb.get(entityId)
  let result = [ name ]
  if (!options.short) {
    if (category) {
      result.push(', ', category)
    }
  }
  return result
}

function subjectRenderer ($$, entityId, entityDb, options = {}) {
  let { category, name } = entityDb.get(entityId)
  let result = [ name ]
  if (!options.short) {
    if (category) {
      result.push(', ', category)
    }
  }
  return result
}

/*
  Exports
*/
export default {
  'article-ref': _delegate(articleRenderer),
  'person': _delegate(personRenderer),
  'group': _delegate(groupRenderer),
  'book-ref': _delegate(bookRenderer),
  'chapter-ref': _delegate(chapterRenderer),
  'journal-article-ref': _delegate(journalArticleRenderer),
  'conference-paper-ref': _delegate(conferencePaperRenderer),
  'report-ref': _delegate(reportRenderer),
  'organisation': _delegate(organisationRenderer),
  'funder': _delegate(funderRenderer),
  'data-publication-ref': _delegate(dataPublicationRenderer),
  'magazine-article-ref': _delegate(magazineArticleRenderer),
  'newspaper-article-ref': _delegate(newspaperArticleRenderer),
  'software-ref': _delegate(softwareRenderer),
  'thesis-ref': _delegate(thesisRenderer),
  'webpage-ref': _delegate(webpageRenderer),
  'keyword': _delegate(keywordRenderer),
  'ref-contrib': _delegate(refContribRenderer),
  'patent-ref': _delegate(patentRenderer),
  'subject': _delegate(subjectRenderer)
}

/*
  Helpers
*/
function _renderAuthors ($$, authors, entityDb) {
  let fragments = []
  authors.forEach((refContribId, i) => {
    fragments = fragments.concat(
      refContribRenderer($$, refContribId, entityDb, { short: true })
    )
    if (i < authors.length - 1) {
      fragments.push(', ')
    }
  })
  return fragments
}

function _renderDate ($$, year, month, day, format) {
  if (year) {
    if (month) {
      if (day) {
        return year + ' ' + _renderMonth(month, format) + ' ' + day
      } else {
        return year + ' ' + _renderMonth(month, format)
      }
    } else {
      return year
    }
  }
}

function _renderMonth (month, format) {
  let monthNames
  if (format === 'long') {
    monthNames = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  } else {
    monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
  if (month) {
    return monthNames[month] || month
  }
}

function _renderDOI ($$, doi) {
  return $$('a').attr({
    href: `https://doi.org/${doi}`,
    target: '_blank'
  }).append(
    'https://doi.org/',
    doi
  )
}

function _renderLocation ($$, fpage, lpage, pageRange, elocationId) {
  if (pageRange) {
    // Give up to three page ranges, then use passim for more, see
    // https://www.ncbi.nlm.nih.gov/books/NBK7282/box/A33679/?report=objectonly
    let parts = pageRange.split(',')
    if (parts.length > 3) {
      return parts.slice(0, 3).join(',') + ' passim'
    } else {
      return pageRange
    }
  } else if (fpage) {
    if (lpage) {
      // Do not repeat page numbers unless they are followed by a letter
      // e.g. 211-218 => 211-8 but 211A-218A stays
      if (fpage.length === lpage.length && /^\d+$/.test(fpage) && /^\d+$/.test(lpage)) {
        let i
        for (i = 0; i < fpage.length; i++) {
          if (fpage[i] !== lpage[i]) break
        }
        return fpage + '-' + lpage.substring(i)
      }
      return fpage + '-' + lpage
    } else {
      return fpage
    }
  } else if (elocationId) {
    return elocationId
  }
}

function _renderPublisherPlace ($$, place, publisher) {
  if (place && publisher) {
    return ' ' + place + ': ' + publisher + '; '
  } else if (place) {
    return ' ' + place + '; '
  } else if (publisher) {
    return ' ' + publisher + '; '
  } else {
    return ''
  }
}

function _getInitials (givenNames) {
  return givenNames.split(' ').map(part => {
    return part[0] ? part[0].toUpperCase() : ''
  }).join('')
}

function _delegate (fn) {
  return function (entityId, db, exporter, options) {
    let el = _createElement()
    let $$ = el.createElement.bind(el)
    let fragments = fn($$, entityId, db, exporter, options)
    el.append(fragments)
    return el.innerHTML
  }
}

function _createElement () {
  return DefaultDOMElement.parseSnippet('<div>', 'html')
}
