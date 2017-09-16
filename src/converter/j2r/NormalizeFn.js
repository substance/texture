/*
  Normilize Footnotes contents.
  Removes everything except textual paragraphs from Footnotes.
*/
export default class NormalizeFn {

  import(dom) {
    let fns = dom.findAll('fn')
    fns.forEach(fn => {
      let paragraphs = []
      let ptags = fn.findAll('p')
      ptags.forEach(p => {
        if(p.children.length === 0) {
          paragraphs.push(p.getTextContent())
        }
      })

      fn.children.forEach(child => {
        fn.removeChild(child)
      })
      paragraphs.forEach(text => {
        fn.append(
          dom.createElement('p').append(text)
        )
      })
    })
  }

  export() {
    // nothing
  }
}
