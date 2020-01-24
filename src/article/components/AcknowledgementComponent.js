import { NodeComponent } from '../../kit';

export default class AcknowledgementComponent extends NodeComponent {
  getInitialState() {
    let items = this._getAcknowledgements();
    return {
      hidden: items.length === 0
    };
  }

  render($$) {
    let el = $$('div').addClass('sc-acknowledgement');
    el.append(
      this._renderValue($$, 'content', {
        placeholder: this.getLabel('acknowledgement-placeholder')
      })
    );
    return el;
  }

  _getAcknowledgements() {
    return this.props.node.content;
  }
}
