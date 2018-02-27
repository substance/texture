import { findChild } from '../util/domHelpers'

export default class NormalizeHistoryDates {

  import(dom) {
    dom.findAll('article-meta > history > date').forEach(_importDate)
  }

  export(dom) {
    dom.findAll('article-meta > history > date').forEach(_exportDate)
  }

}

function _importDate(date) {
  let dom = date.getOwnerDocument()
  // classify the date by inspecting the content
  let season = date.find('season')
  let stringDate = date.find('string-date')
  let dateFormat = 'standard'
  if (season) {
    dateFormat = 'seasonal'
  } else if (stringDate) {
    dateFormat = 'custom'
  }
  date.attr('format', dateFormat)
  // in TextureArticle we use a super-record, capable of containing all
  // variants
  let els = ['day', 'month', 'season', 'year', 'era', 'string-date'].map((name) => {
    return findChild(date, name) || dom.createElement(name).append("")
  })
  date.empty()
  date.append(els)
}

function _exportDate(date) {
  let children = date.getChildren()
  let dateFormat = date.attr('format')
  date.empty()
  date.removeAttribute('format')
  switch (dateFormat) {
    case 'seasonal': {
      date.append(_pickButPruneEmptyOptionals(children, {
        'season': 'required',
        'year': 'required',
        'era': 'optional'
      }))
      break
    }
    case 'custom': {
      date.append(_pickButPruneEmptyOptionals(children, {
        'string-date': 'required'
      }))
      break
    }
    // 'standard'
    default:
      date.append(_pickButPruneEmptyOptionals(children, {
        'day': 'optional',
        'month': 'optional',
        'year': 'required',
        'era': 'optional'
      }))
  }
}

// TODO: this seems to be a useful helper
// but we need a better name
function _pickButPruneEmptyOptionals(els, specs) {
  return els.filter((el) => {
    let spec = specs[el.tagName]
    return (spec && (spec !== 'optional' || el.textContent))
  })
}
