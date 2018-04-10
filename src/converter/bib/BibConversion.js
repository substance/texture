/*
  Converts a CSLJSON record to our internal format.
  See EntityDatabase for schemas.
*/

export function convertCSLJSON(source) {
  let bibType = source.type
  let result

  if (bibType === 'article-journal') {
    result = _convertJournalArticleFromCSLJSON(source)
  } else {
    throw new Error(`Bib type ${bibType} not yet supported`)
  }
  return result
}

function _convertJournalArticleFromCSLJSON(source) {
  const date = _extractDateFromCSLJSON(source)

  let data = {
    type: 'journal-article',
    authors: source.author.map(a => {return {surname: a.family, givenNames: a.given}}),
    articleTitle: source.title,
    source: source['container-title'],
    volume: source.volume,
    issue: source.issue,
    pageRange: source.page,
    doi: source.DOI,
    year: date.year,
    month: date.month,
    day: date.day
  }

  // Cleanup output to avoid any undefined values
  Object.keys(data).forEach(key => {
    if(data[key] === undefined) {
      delete data[key]
    }
  })

  if(!data.doi) {
    throw new Error(`Citation must have DOI.`)
  }

  return data
}

function _extractDateFromCSLJSON(source) {
  let date = {}
  if(source.issued && source.issued['date-parts']) {
    let CSLdate = source.issued['date-parts']
    if(CSLdate.length > 0) {
      date.year = String(CSLdate[0][0])
      if(CSLdate[0][1]) {
        date.month = CSLdate[0][1] > 9 ? String(CSLdate[0][1]) : 0 + String(CSLdate[0][1])
      }
      if(CSLdate[0][2]) {
        date.day = CSLdate[0][2] > 9 ? String(CSLdate[0][2]) : 0 + String(CSLdate[0][2])
      }
    }
  }
  return date
}
