module.exports = function (coverage) {
  const path = require('path')
  // create the ESM loader first
  let _require = require('esm')(module)
  // and let 'module-alias' register on top of the ESM loaded
  const moduleAlias = _require('module-alias')
  // register an alias for the texture module w.r.t. to the build target
  // default vs coverage
  let textureEntryPoint
  if (coverage) {
    textureEntryPoint = path.join(__dirname, '..', 'tmp', 'texture.instrumented.cjs.js')
  } else {
    textureEntryPoint = path.join(__dirname, '..', 'index.js')
  }
  moduleAlias.addAlias('substance-texture', textureEntryPoint)
  moduleAlias.addAlias('texture', textureEntryPoint)
  // register the alias module loaded
  moduleAlias()

  return _require
}
