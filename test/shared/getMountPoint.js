import { DefaultDOMElement, platform } from 'substance'

/*
  ATTENTION: need to override this to correctly deal with DefaultDOMElement._forceMemoryDOM
*/
export default function getMountPoint (t) {
  if (platform.inBrowser && !DefaultDOMElement._forceMemoryDOM) {
    // when running with substance-test we get a sandbox for each test
    if (t.sandbox) return t.sandbox
    let bodyEl = DefaultDOMElement.wrap(window.document.body)
    let sandboxEl = bodyEl.createElement('div')
    // if we are in the browser we append an element to the body
    bodyEl.append(sandboxEl)
    return sandboxEl
  } else {
    // otherwise we create a detached DOM
    let htmlDoc = DefaultDOMElement.parseHTML('<html><body></body></html>')
    return htmlDoc.find('body')
  }
}
