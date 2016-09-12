'use strict';

import { LinkPackage } from 'substance'

function ExtLinkCommand() {
  ExtLinkCommand.super.apply(this, arguments);
}

ExtLinkCommand.Prototype = function() {
  this.getAnnotationData = function() {
    return {
      attributes: {
        'xlink:href': ''
      }
    };
  };
};

LinkPackage.LinkCommand.extend(ExtLinkCommand);

export default ExtLinkCommand;