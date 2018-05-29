import DefaultModel from './DefaultModel'

export default class FigureModel extends DefaultModel {
  
  // Tpye is different to JATS node types (fig, table-wrap)
  get type() {
    return 'figure'
  }
}