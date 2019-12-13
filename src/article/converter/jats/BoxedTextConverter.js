import { findAllChildren } from '../util/domHelpers'

// A converter for the JATS '<boxed-text>' element, which internally maps to a 'box' type.
export default class BoxedTextConverter
{
  get type ()
  {
    return 'box';
  }

  get tagName ()
  {
    return 'boxed-text';
  }

  import (el, node, importer)
  {
    let $$ = el.createElement.bind(el.getOwnerDocument());
    let pEls = findAllChildren(el, 'p');
    if (pEls.length === 0)
    {
      pEls.push($$('p'));
    }
    
    node.content = pEls.map(p => {
      return importer.convertElement(p).id;
    })
  }

  export (node, el, exporter)
  {
    let $$ = exporter.$$;
    let content = node.resolve('content');
    el.append(
      content.map(p => {
        return exporter.convertNode(p);
      })
    )
  }
}
