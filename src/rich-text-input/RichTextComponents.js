import { AnnotationComponent } from 'substance'

export class StrongComponent extends AnnotationComponent {
  getTagName() {
    return 'strong'
  }
}

export class EmphasisComponent extends AnnotationComponent {
  getTagName() {
    return 'em'
  }
}

export class SuperscriptComponent extends AnnotationComponent {
  getTagName() {
    return 'sup'
  }
}

export class SubscriptComponent extends AnnotationComponent {
  getTagName() {
    return 'sub'
  }
}