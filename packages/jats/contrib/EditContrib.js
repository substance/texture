import { Component } from 'substance'
import { saveContrib } from './contribUtils'

class EditContrib extends Component {

  getXML() {
    return this.refs.xml.val()
  }

  render($$) {
    let Input = this.getComponent('input')
    let Button = this.getComponent('button')

    let el = $$('div').addClass('sc-edit-contrib')
    let affs = this.props.affs
    let fullName = this.props.fullName
    let selectedAffs = this.props.selectedAffs

    let affSel = $$('select').attr({multiple: 'multiple'}).ref('affSel')

    affs.forEach(function(a) {
      let opt = $$('option')
        .attr({value: a.node.id})
        .append(a.name)

      if (selectedAffs[a.node.id]) {
        opt.attr('selected', 'selected')
      }
      affSel.append(opt)
    })

    el.append(
      $$('div').addClass('se-label').append('Name:'),
      $$('div').addClass('se-fullname').append(
        $$(Input, {
          type: 'text',
          value: fullName,
          placeholder: 'Enter full name of author'
        }).ref('fullName')
      ),
      $$('div').addClass('se-label').append('Affiliations:'),
      affSel
    )

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    )
    return el
  }

  _save() {
    let contribData = {
      id: this.props.node.id,
      selectedAffs: getSelectedOptions(this.refs.affSel.el.el),
      fullName: this.refs.fullName.val()
    }

    let documentSession = this.context.documentSession
    saveContrib(documentSession, contribData)
    this.send('closeModal')
  }

  _cancel() {
    this.send('closeModal')
  }
}


// arguments: reference to select list, callback function (optional)
function getSelectedOptions(sel, fn) {
  let opts = [], opt

  // loop through options in select list
  for (let i=0, len=sel.options.length; i<len; i++) {
    opt = sel.options[i]

    // check if selected
    if ( opt.selected ) {
      // add to array of option elements to return from this function
      opts.push(opt.value)

      // invoke optional callback function if provided
      if (fn) {
        fn(opt)
      }
    }
  }
  // return array containing references to selected option elements
  return opts
}

export default EditContrib
