import { FormRowComponent, NodeComponent } from '../../kit'

export default class PermissionComponent extends NodeComponent
{
  render ($$)
  {
    const node = this.props.node
    const Button = this.getComponent('button')
    let el = $$('div').addClass('sc-content');
    el.append($$(Button, {
        icon: 'remove'
        }).addClass('se-remove-value')
        .on('click', this._onRemove)
    )
    el.append($$(FormRowComponent, { label: this.getLabel('copyrightStatement')} ).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'copyrightStatement', {
            placeholder: this.getLabel('copyrightStatement-placeholder')
        }).addClass('sm-name')
        )
    )
    el.append($$(FormRowComponent, { label: this.getLabel('copyrightYear')} ).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'copyrightYear', {
            placeholder: this.getLabel('copyrightYear-placeholder')
        }).addClass('sm-name')
        )
    )
    el.append($$(FormRowComponent, { label: this.getLabel('copyrightHolder')} ).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'copyrightHolder', {
            placeholder: this.getLabel('copyrightHolder-placeholder')
        }).addClass('sm-name')
        )
    )
    el.append($$(FormRowComponent, { label: this.getLabel('licenseText')} ).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'licenseText', {
            placeholder: this.getLabel('licenseText-placeholder')
        }).addClass('sm-name')
        )
    )
    el.append($$(FormRowComponent, { label: this.getLabel('license')} ).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'license', {
            placeholder: this.getLabel('license-placeholder')
        }).addClass('sm-name')
        )
    )
    return el
  }

  _onRemove () {
    this.send('removePermission', this.props.node)
  }
}
