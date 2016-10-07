import { Container } from 'substance'

class Graphic extends Container {

  getHref() {
    return this.attributes['xlink:href']
  }

}

Graphic.type = 'graphic'

Graphic.define({
  attributes: { type: 'object', default: {} }
})

export default Graphic
