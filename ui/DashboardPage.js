'use strict';

var Component = require('substance/ui/Component');

function DashboardPage() {
  Component.apply(this, arguments);
}

DashboardPage.Prototype = function() {

  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-dashboard');
    el.append($$('p').append('Choose an example-document'));
    el.append(
      $$('p').append(
        $$('a').attr({href: '#page=document,documentUrl=data/elife-00007.xml'}).append('ELIFE_00007')
      )
    );
    return el;
  };
};

Component.extend(DashboardPage);
module.exports = DashboardPage;