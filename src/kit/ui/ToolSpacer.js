import { Component } from 'substance'

export default class ToolSpacer extends Component {
  render ($$) {
    return $$('div').addClass('sc-tool-spacer')
  }
}
