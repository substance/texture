import DropdownEditor from '../shared/DropdownEditor'

export default class SpecificUseEditor extends DropdownEditor {
  _getLabel ()
  {
    return this.getLabel('specificUse');
  }

  _getValues ()
  {
    return [
      {
        id: 'generated',
        name: 'Generated'
      },
      {
        id: 'supporting',
        name: 'Supporting'
      },
      {
        id: 'analyzed',
        name: 'Analyzed'
      },
      {
        id: 'non-analyzed',
        name: 'Non-analyzed'
      }
    ];
  }
}
