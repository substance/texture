import { XMLTextElement } from 'substance'

export default class XMLListItemNode extends XMLTextElement {
  get level () {
    return this.getLevel()
  }

  getLevel () {
    return parseInt(this.attributes.level, 10)
  }

  setLevel (newLevel) {
    if (this.getLevel() !== newLevel) {
      this.setAttribute('level', newLevel)
    }
  }

  static isListItem () {
    return true
  }
}

XMLListItemNode.type = 'list-item'
