import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { FontAwesomeIcon } from 'substance';
import { getLabel, sortCitationsByPosition } from '../shared/nodeHelpers';

export default class AffiliationsListComponent extends CustomSurface {
  getInitialState() {
    let items = this._getAffiliations();
    return {
      hidden: items.length === 0
    };
  }

  didMount() {
    super.didMount();

    const appState = this.context.editorState;
    // FIXME: it is not good to rerender on every selection change.
    // Instead it should derive a state from the selection, and only rerender if the
    // state has changed (not-selected, selected + author id)
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' });
  }

  dispose() {
    super.dispose();
    this.context.editorState.removeObserver(this);
  }

  render($$) {
    let el = $$('div').addClass('sc-affiliations-list');
    el.append(this._renderAffiliations($$));
    return el;
  }

  _renderAffiliations($$) {
    const affiliations = this._getAffiliations();
    const Button = this.getComponent('button');

    let els = [];
    affiliations.forEach((affiliation, index) => {
      const affiliationEl = $$(AffiliationDisplay, { node: affiliation }).ref(affiliation.id);
      els.push(affiliationEl);
    });

    els.push(
      $$(Button, {
        icon: 'insert',
        label: this.getLabel('add-affiliation')
      })
        .addClass('se-add-affiliation')
        .on('click', this._addAffiliation)
    );
    return els;
  }

  _getCustomResourceId() {
    return 'affiliations-list';
  }

  _getAffiliations() {
    return this.props.model.getItems().sort(sortCitationsByPosition);
  }

  _addAffiliation() {}
}

class AffiliationDisplay extends NodeComponent {
  render($$) {
    let label = this._getAffiliationLabel();
    let el = $$('div').addClass('sc-affiliation');
    el.append(
      $$(label === '?' ? 'div' : 'sup')
        .addClass('se-label')
        .append(label),
      $$('div')
        .addClass('se-text')
        .append(this.props.node.toString()),
      $$(FontAwesomeIcon, { icon: 'fa-edit' }).addClass('se-icon')
    ).attr('data-id', this.props.node.id);

    el.on('mousedown', this._onMousedown).on('click', this._onClick);
    return el;
  }

  _onMousedown(e) {
    e.stopPropagation();
    if (e.button === 2) {
      this._select();
    }
  }

  _onClick(e) {
    e.stopPropagation();
    this._select();
  }

  _select() {
    this.context.api.selectEntity(this.props.node.id);
  }

  _getAffiliationLabel() {
    return getLabel(this.props.node) || '?';
  }
}
