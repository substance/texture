const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const electron = require('electron')

let editorPackage = require.resolve('../dist/app/package.json')
let editorDir = path.dirname(editorPackage)
let args = [editorDir].concat(process.argv.slice(2))
let child = cp.spawn(electron, args, {stdio: 'inherit'})
child.on('close', function (code) {
  process.exit(code)
})
