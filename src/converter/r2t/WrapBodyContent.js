import unwrapChildren from '../util/unwrapChildren'

export default class WrapBodyContent {

  import(dom) {
    let bodies = dom.findAll('body')
    bodies.forEach((body) => {
      const sigBlock = body.find('sig-block')
      const children = body.children
      body.empty()
      body.append(
        dom.createElement('body-content').append(children)
      )
      if (sigBlock) {
        body.append(sigBlock)
      }
    })
  }

  export(dom) {
    let contentEls = dom.findAll('body-content')
    contentEls.forEach((el) => {
      unwrapChildren(el)
    })
  }
}
