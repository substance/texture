import GraphicConverter from './GraphicConverter'

export default class InlineGraphicConverter extends GraphicConverter {
  get type () { return 'inline-graphic' }

  get tagName () { return 'inline-graphic' }
}
