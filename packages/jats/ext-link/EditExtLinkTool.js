'use strict';

import { EditLinkTool } from 'substance'
import clone from 'lodash/clone'

class EditExtLinkTool extends EditLinkTool {

}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href'];

export default EditExtLinkTool;
