import { Component } from 'substance'
import { printElement } from './util/domHelpers'

export default class JATSImportDialog extends Component {

  render($$) {
    const errors = this.props.errors
    let el = $$('div').addClass('sc-jats-import-dialog')
    el.append($$('h1').addClass('se-title').text('Importing JATS'))

    Object.keys(errors).forEach((stageName) => {
      el.append($$(ImportStage, {
        stage: stageName,
        errors: errors[stageName]
      }))
    })

    return el
  }

}

class ImportStage extends Component {

  render($$) {
    const errors = this.props.errors
    let el = $$('div').addClass('sc-import-stage')
    el.append($$('h2').addClass('se-title').text(_getTitle(this.props.stage)))

    if (this.props.errors.length > 0) {
      let errorsEl = $$('div').addClass('se-errors')
      errors.forEach((err) => {
        errorsEl.append(this._renderError($$, err))
      })
      el.append(errorsEl)
    }
    return el
  }

  _renderError($$, err) {
    let el = $$('div').addClass('se-error')
    // TODO: maybe we will have more structured errors
    el.append(
      $$('div').addClass('se-message').text(err.msg)
    )
    if (err.el) {
      el.append(
        $$('pre').addClass('se-element').text(printElement(err.el, { maxLevel: 1}))
      )
    }
    return el
  }
}

const TITLES = {
  'parse': 'Parse XML',
  'validate-jats': 'Validate JATS',
  'validate-jats4r': 'Validate JATS4R',
  'validate-texture-jats': 'Validate TextureJATS',
  'j2r': 'Transform JATS -> JATS4R',
  'r2t': 'Transform JATS4R -> TextureJATS'
}

function _getTitle(stage) {
  return TITLES[stage]
}
