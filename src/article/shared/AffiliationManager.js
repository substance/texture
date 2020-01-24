import { documentHelpers } from 'substance';
import { sortCitationsByPosition } from './nodeHelpers';

export default class AffiliationManager {
  constructor(editorSession) {
    this.editorSession = editorSession;
    this.refType = 'aff';
    this.targetTypes = new Set('affiliation');

    editorSession.on('change', this._onDocumentChange, this);

    // compute initial labels
    this._updateLabels('initial');
  }

  // Unregister the event listener
  dispose() {
    this.editorSession.off(this);
  }

  // Handler for 'change' events
  _onDocumentChange(change) {
    // HACK: do not react on node state updates
    if (change.info.action === 'node-state-update') return;

    const ops = change.ops;
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i];
      if (op.isNOP()) continue;
      // 1. xref has been added or removed
      // 2. citable has been add or removed
      if (this._detectAddRemoveAffiliation(op) || this._detectAddRemoveAuthor(op, change)) {
        return this._updateLabels();
        // 3. xref targets have been changed
        // 4. refType of an xref has been changed (TODO: do we really need this?)
      } else if (this._detectChangeAuthor(op)) {
        return this._updateLabels();
      }
    }
  }

  getAuthors() {
    return documentHelpers.getNodesForIds(this._getDocument(), this._getAuthorIds());
  }

  getAffiliations(sorted = true) {
    const affiliations = documentHelpers.getNodesForIds(this._getDocument(), this._getAffiliationIds());
    if (sorted) {
      affiliations.sort(sortCitationsByPosition);
    }
    return affiliations;
  }

  hasAffiliations() {
    let ids = this._getAffiliationIds();
    return ids.length > 0;
  }

  _getAffiliationIds() {
    let doc = this._getDocument();
    let metadata = doc.get('metadata');
    return metadata.affiliations;
  }

  hasAuthors() {
    let ids = this._getAuthorIds();
    return ids.length > 0;
  }

  _getAuthorIds() {
    let doc = this._getDocument();
    let metadata = doc.get('metadata');
    return metadata.authors;
  }

  _detectAddRemoveAffiliation(op) {
    if (op.isCreate() || op.isDelete()) {
      // TODO: it would be nice to have real node instances in change
      // to inspect the class/prototype
      let doc = this._getDocument();
      let schema = doc.getSchema();
      return schema.isInstanceOf(op.val.type, 'affiliation');
    } else {
      return false;
    }
  }

  _detectAddRemoveAuthor(op) {
    if (op.isCreate() || op.isDelete()) {
      // TODO: it would be nice to have real node instances in change
      // to inspect the class/prototype
      let doc = this._getDocument();
      let schema = doc.getSchema();
      return schema.isInstanceOf(op.val.type, 'person');
    } else {
      return false;
    }
  }

  _detectChangeAuthor(op) {
    if (op.path[1] === 'affiliations') {
      let doc = this._getDocument();
      let node = doc.get(op.path[0]);
      return node && node.type === 'person';
    } else {
      return false;
    }
  }

  _updateLabels(silent) {
    let authors = this.getAuthors();
    let affiliations = this.getAffiliations();
    let stateUpdates = [];

    let index = 1;
    let affilationLabels = {};

    authors.forEach(author => {
      let tmpLabel = author.affiliations.map(affiliation => {
        if (affilationLabels[affiliation]) {
          return affilationLabels[affiliation];
        } else {
          affilationLabels[affiliation] = index;
          stateUpdates.push([affiliation, { label: index, pos: index }]);
          return index++;
        }
      });
      stateUpdates.push([author.id, { label: tmpLabel.join(',') }]);
    });

    affiliations.forEach(affiliation => {
      if (!affilationLabels[affiliation.id]) {
        stateUpdates.push([affiliation.id, { label: '', pos: Number.MAX_VALUE }]);
      }
    });

    // FIXME: here we also made the 'collection' dirty originally
    this.editorSession.updateNodeStates(stateUpdates, { silent });
  }

  _getDocument() {
    return this.editorSession.getDocument();
  }
}
