/*
  Simple plain text renderer for available entities
*/

export default {
  'person': function({ givenNames, surname}) {
    return [ givenNames, surname ].join(' ')
  }
}
