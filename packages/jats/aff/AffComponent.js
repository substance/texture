'use strict';

var Component = require('substance/ui/Component');

class AffComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  render($$) {
    var aff = this.props.node.getObject();
    var el = $$('div').addClass('sc-aff')
      .append(aff.name);
    return el;
  }
}

module.exports = AffComponent;
