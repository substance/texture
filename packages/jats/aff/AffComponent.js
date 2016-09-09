'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');

var getAdapter = require('./affUtils').getAdapter;

class AffComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  render($$) {
    var aff = getAdapter(this.props.node);
    var el = $$('div').addClass('sc-aff')
      .append($$(Icon, {icon: 'fa-building-o'}))
      .append(' '+aff.name);
    return el;
  }
}

module.exports = AffComponent;
