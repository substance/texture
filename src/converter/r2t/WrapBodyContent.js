import { unwrapChildren } from '../util/domHelpers'

export default class WrapBodyContent {

  import(dom) {
    let bodies = dom.findAll('body')
    bodies.forEach((body) => {
      const sigBlock = body.find('sig-block')
      const children = body.children
      // Ensure there is at least one p element inside body
      if (children.length ===0) {
        children.push(dom.createElement('p'))
      }
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
    contentEls.forEach(unwrapChildren)
  }
}
