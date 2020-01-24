import { findAllChildren } from '../util/domHelpers';
import { getLabel } from '../../shared/nodeHelpers';

export default class ContributorIdentifierConverter {
  get type() {
    return 'contributor-identifier';
  }

  get tagName() {
    return 'contrib-id';
  }

  import(el, node, importer) {
    let assigningAuthority = el.attr('assigning-authority');
    if (assigningAuthority) {
      node.assigningAuthority = assigningAuthority;
    }
    let authenticated = el.attr('authenticated');
    if (authenticated) {
      node.authenticated = authenticated === 'true';
    }
    let contentType = el.attr('content-type');
    if (contentType) {
      node.contentType = contentType;
    }
    let contribIdType = el.attr('contrib-id-type');
    if (contribIdType) {
      node.contribIdType = contribIdType;
    }
    let id = el.attr('id');
    if (id) {
      node.id = id;
    }
    let specificUse = el.attr('specific-use');
    if (specificUse) {
      node.specificUse = specificUse;
    }

    let content = el.textContent;
    if (content) {
      node.content = content;
    }
  }

  export(node, el, exporter) {
    const $$ = exporter.$$;
    // We gonna need to find another way for node states. I.e. for labels we will have
    // a hybrid scenario where the labels are either edited manually, and thus we need to record ops,
    // or they are generated without persisting operations (e.g. think about undo/redo, or collab)
    // my suggestion would be to introduce volatile ops, they would be excluded from the DocumentChange, that is stored in the change history,
    // or used for collaborative editing.
    let label = getLabel(node);
    if (label) {
      el.append($$('label').text(label));
    }
    el.append(node.resolve('content').map(p => exporter.convertNode(p)));
  }
}
