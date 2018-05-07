import { XMLTextElement } from 'substance'

export default
class XMLListItemNode extends XMLTextElement {

  get level() {
    return this.getLevel()
  }

  getLevel() {
    return parseInt(this.attributes.level)
  }

  setLevel(newLevel) {
    if (this.getLevel() !== newLevel) {
      this.setAttribute('level', newLevel)
    }
  }
}

XMLListItemNode.type = 'list-item'
