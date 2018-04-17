import { replaceWith } from '../util/domHelpers'

export default class ConvertMath {
  import(dom) {
    let inlineFormulas = dom.findAll('inline-formula[content-type="math/tex"]')

    inlineFormulas.forEach(ifEl => {
      const texMath = ifEl.find('tex-math')
      const inlineMath = dom.createElement('inline-math')
        .text(texMath.text())

      ifEl.removeChild(texMath)
      replaceWith(ifEl, [inlineMath])
      ifEl.remove()
    })
  }

  export(dom) {
    // let articleMeta = dom.find('front > article-meta')
    // exportContentLoc(articleMeta)
  }
}
