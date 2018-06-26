import { FormRowComponent } from 'substance-texture'
import { Component } from 'substance'

const rows = [
  {
    fields: [{
      id: 'group-name',
      label: 'Group name',
      type: 'text',
      value: 'The Mouse Genome Sequencing Consortium',
      placeholder: 'Enter research group name',
      size: 'large'
    }, {
      id: 'group-email',
      label: 'Email',
      type: 'email',
      value: 'mouse@leconsortium.com',
      placeholder: 'Enter research group email',
      size: 'medium'
    }]
  },
  {
    fields: [{
      id: 'equally-contrib',
      label: 'Equally contributed',
      type: 'checkbox',
      value: true
    },{
      id: 'corresponding',
      label: 'Corresponding',
      type: 'checkbox',
      value: false
    }]
  },
  {
    fields: [{
      id: 'given-names',
      label: 'Given Names',
      type: 'text',
      value: 'Jane',
      placeholder: 'Enter given names',
      size: 'medium'
    }, {
      id: 'surname',
      label: 'Surname',
      type: 'text',
      value: '',
      size: 'medium',
      error: 'Surname must be filled'
    }, {
      id: 'prefix',
      label: 'Prefix',
      type: 'text',
      value: '',
      size: 'small'
    }, {
      id: 'suffix',
      label: 'Suffix',
      type: 'text',
      value: '',
      size: 'small'
    }]
  },
  {
    fields: [{
      id: 'email',
      label: 'Email',
      type: 'email',
      value: 'jane@doe.com',
      placeholder: 'Enter person email',
      size: 'medium'
    }, {
      id: 'orcid',
      label: 'ORCID',
      type: 'text',
      value: '',
      size: 'medium'
    }, {
      id: 'role',
      label: 'Role',
      type: 'text',
      value: '',
      size: 'medium'
    }]
  },
  {
    fields: [{
      id: 'person-qually-contrib',
      label: 'Equally contributed',
      type: 'checkbox',
      value: false
    },{
      id: 'person-corresponding',
      label: 'Corresponding',
      type: 'checkbox',
      value: true
    }]
  }
]

window.addEventListener('load', () => {
  let app = Grid.mount({
    rows: rows
  }, window.document.body)

  setTimeout(() => {
    window.app = app
  }, 500)
})

class Grid extends Component {
  render($$) {
    const rows = this.props.rows
    const el = $$('div').addClass('sc-grid')
    rows.forEach(row => {
      el.append(
        $$(FormRowComponent, {fields: row.fields})
      )
    })
    return el
  }
}
