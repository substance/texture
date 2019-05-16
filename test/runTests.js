const _initLoader = require('./_initLoader')

let isCoverage = Boolean(process.argv.find(p => p === '--coverage'))

let _require = _initLoader(isCoverage)
_require('./index.js')

if (isCoverage) {
  process.on('beforeExit', () => {
    // TODO: we could try to share this code with the electron coverage runner (see builds/test/coverage.html)
    const fs = require('fs')
    const path = require('path')
    let nycOutputDir = path.join(__dirname, '..', '.nyc_output')
    if (!fs.existsSync(nycOutputDir)) {
      fs.mkdirSync(nycOutputDir)
    }
    fs.writeFileSync(path.join(nycOutputDir, 'texture.nodejs.json'), JSON.stringify(global.__coverage__))
  })
}
