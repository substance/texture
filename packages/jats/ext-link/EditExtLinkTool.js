'use strict';

import { LinkPackage } from 'substance'
import clone from 'lodash/clone'

function EditExtLinkTool() {
  EditExtLinkTool.super.apply(this, arguments);
}

LinkPackage.EditLinkTool.extend(EditExtLinkTool);

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href'];

EditExtLinkTool.getProps = function(commandStates) {
  if (commandStates['ext-link'].mode === 'edit') {
    return clone(commandStates['ext-link']);
  } else {
    return undefined;
  }
};

export default EditExtLinkTool;
