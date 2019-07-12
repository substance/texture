import { AnnotationCommand as SubstanceAnnotationCommand } from 'substance'

export default class AnnotationCommand extends SubstanceAnnotationCommand {
  canCreate (annos, sel, context) {
    return context.api.canCreateAnnotation(this.getType())
  }
}
