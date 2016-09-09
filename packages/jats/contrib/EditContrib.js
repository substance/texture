'use strict';

var Component = require('substance/ui/Component');

class EditContrib extends Component {

  getXML() {
    return this.refs.xml.val();
  }

  render($$) {
    var el = $$('div').addClass('sc-edit-contrib');

    el.append(
      'TODO: Implement form editor for contrib nodes'
      // $$('textarea')
      //   .ref('xml')
      //   .append(this.props.xml)
    );
    return el;
  }

}

module.exports = EditContrib;
