import { platform } from 'substance'

// HACK: using this to obfuscate loading of modules in nodejs
// Instead, we should not use `require()` but use stub modules for bundling
export default function (p) {
  let f = require
  if (platform.inNodeJS || platform.inElectron) {
    return f(p)
  }
}
