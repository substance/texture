import { AnnotationTool } from 'substance'

function AddXRefTool() {
  AddXRefTool.super.apply(this, arguments);
}

AnnotationTool.extend(AddXRefTool);

export default AddXRefTool