import { Component } from 'substance'

/*
  This is an eperimental wrap component for rendering a section in dialogs
  with label and description on top of content.
  Example:
  ```
    $$(DialogSectionComponent, {label: 'Enter DOI', description: 'use a comma to separate values'})
      .append($$(DOIInput))
  ```
*/
export default class DialogSectionComponent extends Component {
  render ($$) {
    const label = this.props.label
    const description = this.props.description
    const children = this.props.children

    const el = $$('div').addClass('sc-dialog-section')

    if (label) {
      const sectionTitleEl = $$('div').addClass('se-dialog-section-title').append(
        $$('div').addClass('se-label').append(label)
      )
      if (description) {
        sectionTitleEl.append(
          $$('div').addClass('se-label').append(description)
        )
      }
      el.append(sectionTitleEl)
    }
    el.append(
      $$('div').addClass('se-dialog-section-content').append(children)
    )
    return el
  }
}
