const _global = (typeof global !== 'undefined') ? global : window
const textureGlobals = _global.hasOwnProperty('Texture') ? _global.Texture : _global.Texture = {
  DEBUG: false
}
export default textureGlobals
