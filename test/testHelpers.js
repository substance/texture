import { test } from 'substance-test'
import { isFunction, MemoryDOMElement, platform } from 'substance'

export function spy (self, name) {
  var f
  if (arguments.length === 0) {
    f = () => {}
  } else if (arguments.length === 1 && isFunction(arguments[0])) {
    f = arguments[0]
  } else {
    f = self[name]
  }
  function spyFunction () {
    var res = f.apply(self, arguments)
    spyFunction.callCount++
    spyFunction.args = arguments
    return res
  }
  spyFunction.callCount = 0
  spyFunction.args = null
  spyFunction.restore = () => {
    if (self) {
      self[name] = f
    }
  }
  spyFunction.reset = () => {
    spyFunction.callCount = 0
    spyFunction.args = null
  }
  if (self) {
    self[name] = spyFunction
  }
  return spyFunction
}

export function wait (ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function getMountPoint (t) {
  let mountPoint
  if (platform.inBrowser) {
    mountPoint = t.sandbox
  } else {
    let htmlDoc = MemoryDOMElement.parseMarkup('<html><body></body></html>', 'html')
    mountPoint = htmlDoc.find('body')
  }
  return mountPoint
}

export function testAsync (name, func) {
  test(name, async assert => {
    let success = false
    try {
      await func(assert)
      success = true
    } finally {
      if (!success) {
        assert.fail('Test failed with an uncaught exception.')
        assert.end()
      }
    }
  })
}
