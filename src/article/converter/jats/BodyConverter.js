import SectionContainerConverter from './SectionContainerConverter'

export default class BodyConverter extends SectionContainerConverter {
  get type () { return 'body' }

  get tagName () { return 'body' }
}
