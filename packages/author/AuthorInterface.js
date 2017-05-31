import { Component } from 'substance'

/*

  TODO: specify the basic structure of the authoring interface,
  i.e. panels, tool-panels, etc.
*/
export default
class AuthorInterface extends Component {

  render($$) {
    let el = $$('div').addClass('sc-author')
    return el
  }

}