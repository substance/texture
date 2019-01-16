import { Component } from 'substance'
import { addModelObserver, removeModelObserver } from '../../kit'
import MetadataCollectionComponent from './MetadataCollectionComponent'

export default class MetadataSection extends Component {
  didMount () {
    addModelObserver(this.props.model, this._onModelUpdate, this)
  }

  dispose () {
    removeModelObserver(this)
  }

  render ($$) {
    const model = this.props.model
    const name = this.props.name
    // const label = this.getLabel(model.id)
    let el = $$('div').addClass('sc-metadata-section').addClass(`sm-${name}`)
    if (model.type === 'collection') {
      let label = this.getLabel(name)
      el.append(
        $$('div').addClass('se-heading').attr('id', model.id).append(
          $$('div').addClass('se-header').append(label)
        )
      )
      el.append(
        $$(MetadataCollectionComponent, { model }).ref('collection')
      )
      if (model.length === 0) {
        el.addClass('sm-empty')
      }
    } else {
      let CustomEditor = this.getComponent(model.id)
      let label = this.getLabel(name)
      el.append(
        $$('div').addClass('se-heading').attr('id', model.id).append(
          $$('div').addClass('se-header').append(label)
        )
      )
      el.append(
        $$(CustomEditor, { model }).ref('editor')
      )
    }
    return el
  }

  // ATTENTION: doing incremental update manually to avoid double rerendering of child collection
  // TODO: it would be good if Substance could avoid rerendering a component twice in one run
  _onModelUpdate () {
    let model = this.props.model
    if (model.type === 'collection') {
      if (model.length === 0) {
        this.el.addClass('sm-empty')
      } else {
        this.el.removeClass('sm-empty')
      }
    }
  }
}
