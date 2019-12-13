import { NodeComponent } from '../../kit'

export default class BoxComponent extends NodeComponent
{
  render ($$)
  {
    let node = this.props.node;

    const Button = this.getComponent('button');
    const SectionLabel = this.getComponent('section-label')

    // Card
    let el = $$('div').addClass('sc-box').attr('data-id', node.id)

    let titleEl = $$('div').addClass('sc-title')

    // Label
    titleEl.append($$(SectionLabel, { label: 'box-title-label' }));

    // Remove Button
    titleEl.append($$(Button, {
      icon: 'remove'
      }).addClass('se-remove-value')
      .on('click', this._onRemove)
    )

    el.append(titleEl);

    // Content
    el.append(
      this._renderValue($$, 'content', { placeholder: this.getLabel('content-placeholder') }),
    )
    return el
  }

  _onRemove ()
  {
    this.send('removeBox', this.props.node)
  }
}
