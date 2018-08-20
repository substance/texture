import { Component } from 'substance'
import { ModalDialog } from '../../kit'
import renderEntity from './renderEntity'
// import AffiliationsListComponent from './AffiliationsListComponent'

export default class AuthorsListComponent extends Component {
  getInitialState () {
    let items = this._getItems()
    return {
      hidden: items.length === 0,
      edit: false
    }
  }

  _getItems () {
    return this.props.model.getItems()
  }

  render ($$) {
    const items = this._getItems()
    let el = $$('div').addClass(this.getClassNames())

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    if (this.state.edit) {
      var modal = $$(ModalDialog, {
        width: 'medium',
        textAlign: 'center'
      })
      el.append(modal)
    }

    let contentEl = $$('div').addClass('se-content')
    if (items.length > 0) {
      items.forEach((item, index) => {
        let short = item.type === 'organisation'
        contentEl.append(
          $$('span').addClass('se-contrib').html(
            // HACK: renderEntity needs a Node
            // TODO: we should have a model based helper instead
            renderEntity(item._node, { short })
          )
        )
        if (index < items.length - 1) {
          contentEl.append(', ')
        }
      })
    } else {
      contentEl.append(
        $$('span').addClass('se-contrib sm-empty').append(this.getEmptyMessage())
      )
    }

    el.append(contentEl)

    // FIXME: display affiliations
    // el.append(
    //   $$(AffiliationsListComponent, {
    //     node: this.props.node
    //   })
    // )
    return el
  }

  getClassNames () {
    return 'sc-authors-list'
  }

  getEmptyMessage () {
    return this.getLabel('no-authors')
  }
}
