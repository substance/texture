/*
  Normalize footnotes contents.
  Removes everything except textual paragraphs from footnotes.
*/
export default class NormalizeFn {

  import(dom) {
    let fns = dom.findAll('fn')
    fns.forEach(fn => {
      // Find all ptags that are nested in another p tag
      let ptags = fn.findAll('p p')
      // If any nested paragraphs are found we need to take action
      if (ptags.length > 0) {
        fn.empty()
        fn.append(ptags)
      }
    })
  }

  export() {
    // nothing
  }
}
