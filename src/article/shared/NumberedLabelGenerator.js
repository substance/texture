import { isArray, last } from 'substance'

/*
  TODO: discuss

  There is a sophisticated cross-referencing package for latex
  that we took as inspiration: http://mirror.easyname.at/ctan/macros/latex/contrib/cleveref/cleveref.pdf

  This generator needs a set of configurations:

  - name: e.g. 'Figure'
  - plural: e.g. 'Figures'
  - and: e.g, ", ", or " and "
  - to: e.g, "--", or " to "
  - template: outer template, e.g. "[$]" could be used to generate "[1-3,4]"
  - groupTemplate: inner template, e.g. "[$]" could be used to generate "[1-3],[4]"

*/
const HYPHEN = '‒'

export default class NumberedLabelGenerator {
  constructor (config = {}) {
    // for labels with a type name such as 'Figure 1'
    this.name = config.name
    // for labels with type name, with multiple refs, such as 'Figures 1-3'
    this.plural = config.plural
    // used to join found groups
    this.and = config.and || ','
    // used to render a single group
    this.to = config.to || HYPHEN
    // a string where '$' will be replaced
    // this can be used to wrap the generated string,
    // e.g. "[$]" could be used to generate "[1-3,4]"
    this.template = config.template
    // a string where '$' will be replaced
    // e.g "[$]" could be used to generate "[1-3],[4]"
    this.groupTemplate = config.groupTemplate
    this.invalid = config.invalid || '???'
  }

  getLabel (numbers) {
    if (!numbers) return this.invalid
    if (!isArray(numbers)) numbers = [numbers]
    if (numbers.length === 0) return this.invalid

    const L = numbers.length
    // ATTENTION: Array.sort() is sorting lexically!
    numbers.sort((a, b) => a - b)

    let frags = []
    if (this.name) {
      if (L === 1) {
        frags.push(this.name)
      } else {
        frags.push(this.plural || this.name)
      }
      frags.push(' ')
    }

    // detect groups such as [1,2,3], [6], [8,9]
    let groups = []
    let group = null
    const _pushBlock = (g) => {
      if (!isArray(g)) g = [g]
      let str
      if (g.length === 1) {
        str = String(g[0])
      } else if (g.length === 2) {
        _pushBlock(g[0])
        _pushBlock(g[1])
        return
      } else {
        // join with the 'to' operator, i.e. [1,2,3] => "1 to 3"
        str = String(g[0]) + this.to + String(last(g))
      }
      if (this.groupTemplate) {
        str = this.groupTemplate.slice(0).replace(/[$]/g, str)
      }
      groups.push(str)
    }
    for (let i = 0; i < L; i++) {
      let n = numbers[i]
      if (n === numbers[i - 1] + 1) {
        group.push(n)
      } else {
        if (group) {
          _pushBlock(group)
        }
        group = [n]
      }
    }
    _pushBlock(group)

    // join all groups with the 'and' operator
    // such as ["1-3", "5"] => "1-3, 4"
    frags.push(groups.join(this.and))

    let res = frags.join('')
    if (this.template) {
      res = this.template.slice(0).replace(/[$]/g, res)
    }
    return res
  }
}
