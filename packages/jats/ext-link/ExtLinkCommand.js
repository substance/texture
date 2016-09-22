'use strict';

import { LinkPackage } from 'substance'

class ExtLinkCommand extends LinkPackage.LinkCommand {

  getAnnotationData() {
    return {
      attributes: {
        'xlink:href': ''
      }
    }
  }
}

export default ExtLinkCommand