import { JATS4R } from '../../article'

/*
  For sake of simplicity we want to use only <history>
  for all dates describing the life-cycle of a publication
*/
export default class UnifyPublicationHistory {

  /*
    Take all <pub-dates> and move them into <history>
  */
  import(dom) {
    let articleMeta = dom.find('article-meta')
    let pubDates = dom.findAll('article-meta > pub-date')
    let history = dom.find('article-meta > history')
    if (!history) {
      history = dom.createElement('history')
      let pos = JATS4R.getElementSchema('article-meta').findFirstValidPos(articleMeta, 'history')
      articleMeta.insertAt(pos, history)
    }
    pubDates.forEach((pubDate) => {
      pubDate.tagName = 'date'
      pubDate.attr('date-type', 'pub')
      history.append(pubDate)
    })
  }

  export(dom) {
    // convert all date-type='pub' into <pub-date>s
    let articleMeta = dom.find('article-meta')
    let history = dom.find('article-meta > history')
    let dates = history.findAll('date')
    let schema = JATS4R.getElementSchema('article-meta')
    let pos = schema.findFirstValidPos(articleMeta, 'pub-date')
    for (let i = dates.length - 1; i >= 0; i--) {
      let date = dates[i]
      let type = date.attr('date-type')
      if (type === 'pub') {
        date.tagName = 'pub-date'
        articleMeta.insertAt(pos, date)
      } else {
        // make sure we discard @pub-type on the others
        date.removeAttribute('pub-type')
      }
    }
  }

}
