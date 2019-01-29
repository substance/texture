import { test } from 'substance-test'
import { openManuscriptEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

test('FigurePackage: load figure package example', t => {
  let { app } = setupTestApp(t, { archiveId: 'figure-package' })
  openManuscriptEditor(app)
  t.pass('figure package sample should render without problems.')
  t.end()
})
