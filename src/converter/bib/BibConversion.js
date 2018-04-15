/*
  Converts a CSLJSON record to our internal format.
  See EntityDatabase for schemas.
*/

export function convertCSLJSON(source) {
  let bibType = source.type
  let result

  // CSL types: http://docs.citationstyles.org/en/stable/specification.html#appendix-iii-types
  let typeMapping = {
    "article": "journal-article",
    "article-magazine": "journal-article",
    "article-newspaper": "journal-article",
    "article-journal": "journal-article",
    //"bill"
    "book": "book",
    //"broadcast"
    "chapter": "book",
    "dataset": "data-publication",
    //"entry"
    "entry-dictionary": "book",
    "entry-encyclopedia": "book",
    //"figure"
    //"graphic"
    //"interview"
    //"legislation"
    //"legal_case"
    //"manuscript"
    //"map"
    //"motion_picture"
    //"musical_score"
    //"pamphlet"
    "paper-conference": "conference-proceeding",
    "patent": "patent",
    //"post"
    //"post-weblog"
    //"personal_communication"
    "report": "report",
    //"review"
    //"review-book"
    //"song"
    //"speech"
    "thesis": "thesis",
    //"treaty"
    "webpage": "webpage"
    //NA : "periodical"
    //NA : "clinical-trial"
    //NA : "preprint"
    //NA : "software"
  }

  if (typeMapping[bibType]) {
    result = _convertFromCSLJSON(source, typeMapping[bibType])
  } else {
    throw new Error(`Bib type ${bibType} not yet supported`)
  }
  return result
}

function _convertFromCSLJSON(source, type) {
  const date = _extractDateFromCSLJSON(source)

  let data = {
    type: type,

    volume: source.volume,
    issue: source.issue,
    pageRange: source.page,
    doi: source.DOI,
    pmid: source.PMID,

    edition: source.edition,
    publisherLoc: source['publisher-place'],
    publisherName: source.publisher,
    pageCount: source['number-of-pages'],
    isbn: source.ISBN,

    year: date.year,
    month: date.month,
    day: date.day,

    uri: source.URL,
    version: source.version

    /* Examples with no corresponding field:
        - abstract
        - accessed
        - collection-title
        - composer
        - director
        - ISSN
        - language
        - number-of-volumes
        - PMCID
        - title-short
        - translator
    */
  }

  // Mapping of title depends on item type
  if (source.type==='book' || source.type==='report') {
    data.source = source.title
  } else if (source.type==='webpage') {
    data.title = source.title
  } else {
    data.source = source['container-title']
    if (source.type==='chapter') {
      data.chapterTitle = source.title
    } else if (source.type==='dataset') {
      data.dataTitle = source.title
    } else {
      data.articleTitle = source.title
    }
  }

  // Authors and editors
  if (source.author) {
    data.authors = source.author.map(a => {return {surname: a.family, givenNames: a.given}})
  }
  if (source.editor) {
    data.editors = source.editor.map(a => {return {surname: a.family, givenNames: a.given}})
  }


  // Cleanup output to avoid any undefined values
  Object.keys(data).forEach(key => {
    if(data[key] === undefined) {
      delete data[key]
    }
  })

  if(!data.doi) {
    // TODO: We should not rely that the imported item has a DOI, because it can also be imported from a generic CSL JSON file.
    //  However, there are some problems in the further processing withouth a DOI at the moment...
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
