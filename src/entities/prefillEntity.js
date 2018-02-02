export function prefillEntity(type, text) {
  let defaults = {
    type
  }
  if (type === 'person') {
    let parts = text.split(' ')
    defaults.surname = parts.pop()
    defaults.givenNames = parts.join(' ')
  } else if (type === 'organisation') {
    defaults.name = text
  } else if (type === 'book') {
    defaults.source = text
  } else if (type === 'journal-article') {
    defaults.articleTitle = text
  } else if (type === 'conference-proceeding') {
    defaults.articleTitle = text
  } else if (type === 'clinical-report') {
    defaults.articleTitle = text
  } else if (type === 'preprint') {
    defaults.articleTitle = text
  } else if (type === 'report') {
    defaults.source = text
  } else if (type === 'periodical') {
    defaults.articleTitle = text
  } else if (type === 'data-publication') {
    defaults.dataTitle = text
  } else if (type === 'patent') {
    defaults.articleTitle = text
  } else if (type === 'webpage') {
    defaults.title = text
  } else if (type === 'thesis') {
    defaults.articleTitle = text
  } else if (type === 'software') {
    defaults.title = text
  }
  return defaults
}
