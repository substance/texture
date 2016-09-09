'use strict';

var Component = require('substance/ui/Component');
var Input = require('substance/ui/Input');
var Button = require('substance/ui/Button');
var saveContrib = require('./contribUtils').saveContrib;

class EditContrib extends Component {

  getXML() {
    return this.refs.xml.val();
  }

  render($$) {
    var el = $$('div').addClass('sc-edit-contrib');
    var affs = this.props.affs;
    var fullName = this.props.fullName;
    var selectedAffs = this.props.selectedAffs;

    var affSel = $$('select').attr({multiple: 'multiple'}).ref('affSel');

    affs.forEach(function(a) {
      var opt = $$('option')
        .attr({value: a.node.id})
        .append(a.name);

      if (selectedAffs[a.node.id]) {
        opt.attr('selected', 'selected');
      }
      affSel.append(opt);
    });

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
    );

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    );
    return el;
  }

  _save() {
    var contribData = {
      id: this.props.node.id,
      selectedAffs: getSelectedOptions(this.refs.affSel.el.el),
      fullName: this.refs.fullName.val()
    };

    var documentSession = this.context.documentSession;
    saveContrib(documentSession, contribData);
    this.send('closeModal');
  }

  _cancel() {
    this.send('closeModal');
  }
}


// arguments: reference to select list, callback function (optional)
function getSelectedOptions(sel, fn) {
  var opts = [], opt;

  // loop through options in select list
  for (var i=0, len=sel.options.length; i<len; i++) {
    opt = sel.options[i];

    // check if selected
    if ( opt.selected ) {
      // add to array of option elements to return from this function
      opts.push(opt.value);

      // invoke optional callback function if provided
      if (fn) {
        fn(opt);
      }
    }
  }
  // return array containing references to selected option elements
  return opts;
}

module.exports = EditContrib;
