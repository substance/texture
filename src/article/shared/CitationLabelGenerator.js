export default class CitationLabelGenerator
{
  constructor (config = {})
  {
    this.invalid = config.invalid || '???'
  }

  /**
   * Returns a citation label for the specified nodes
   *
   * Generates a label in the form (<authors>, <year>) from the supplied node.
   *
   * @param {*} node An element of type 'xref' to genereate a citation label for.
   * @returns {string} the generated label
   * @memberof CitationLabelGenerator
   */
  getLabel (node)
  {
    let label = this.invalid;
    if (node && node.type === 'xref' && node.refTargets.length > 0)
    {
      let count = 0;
      label = '(';
      for (let targetId of node.refTargets)
      {
        let target = node.document.get(targetId);
        if (target)
        {
          if (count > 0)
          {
            label += '; ';
          }

          // FIXME: Reference Nodes should be refactored to have a method for getting the principal person-group.
          let people = (target.type === 'patent-ref') ? target.inventors : target.authors;
          if (people && people.length > 0)
          {
            label += `${target.document.get(people[0]).name}`
          }

          if (people.length > 1)
          {
            label += ' et al.';
          }

          if (target.year)
          {
            label += `, ${target.year}`;
          }
          count += 1;
        }
      }
      label += ')';
    }
    return label;
  }
}
