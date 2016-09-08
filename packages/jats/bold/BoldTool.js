'use strict';

import { AnnotationTool } from 'substance'

function BoldTool() {
  BoldTool.super.apply(this, arguments);
}
AnnotationTool.extend(BoldTool);

export default BoldTool;