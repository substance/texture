export default class StringDateConvertor
{
  get type ()
  { 
    return 'string-date';
  }

  get tagName () 
  { 
    return 'string-date';
  }

  import (el, node, importer)
  {
    let month = el.find('month');
    if (month)
    {
      node.month = month.textContent;
    }

    let day = el.find('day');
    if (day) 
    {
      node.day = day.textContent;
    }

    let season = el.find('season');
    if (season) 
    {
      node.season = season.textContent;
    }

    let era = el.find('era');
    if (era) 
    {
      node.era = era.textContent;
    }

    let year = el.find('year');
    if (year)
    {
      node.year = year.textContent;
    }

    node.iso8601Date = el.attr('iso-8601-date');
  }

  export (node, el, exporter)
  {
    let $$ = exporter.$$;

    if (node.month)
    {
      el.append($$('month').append(node.month))
    }

    if (node.day) 
    {
      el.append($$('day').append(node.day))
    }

    if (node.season) 
    {
      el.append($$('season').append(node.season))
    }

    if (node.era) 
    {
      el.append($$('era').append(node.era))
    }

    // FIXME (#234): The ISO8601 value should be computed.
    if (node.year)
    {
      el.append($$('year').attr('iso-8601-date', node.year).append(node.year));
    }

    // FIXME (#233): The ISO8601 value should be computed.
    if (node.iso8601Date)
    {
      el.attr('iso-8601-date', node.iso8601Date);
    }
  }
}
