/*
  Some destructive conversions, we need right now, as
  we do not have a better model.
*/

export default class Hackz {

  import(dom) {
    _forcePlainText(dom)
    _noEmailInP(dom)
  }

  export() {
    // nothing
  }

}

const forcePlainText = ['corresp', 'funding-source']

function _forcePlainText(dom) {
  dom.findAll(forcePlainText.join(', ')).forEach(_makePlainText)
}

function _makePlainText(el) {
  let text = el.textContent
  el.empty()
  el.textContent = text
}

function _noEmailInP(dom) {
  let emailsInP = dom.findAll('p > email')
  emailsInP.forEach((email) => {
    email.tagName = 'ext-link'
  })
}
