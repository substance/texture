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
  } else if (type === 'journal-article' || type === 'conference-proceeding' || type === 'clinical-report' || type === 'preprint' || type === 'periodical' || type === 'data-publication' || type === 'patent' || type === 'webpage' || type === 'thesis' || type === 'software') {
    defaults.title = text
  }
  return defaults
}
