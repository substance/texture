import { test } from 'substance-test'
import setupTestArticleSession from './setupTestArticleSession'

test('Model: model.isEmpty() for empty containers', t => {
  let { api } = setupTestArticleSession()
  let bodyModel = api.getModelById('body')
  t.ok(bodyModel.isEmpty(), 'body model should be empty.')
  t.end()
})

test('Model: model.isEmpty() for empty child nodes', t => {
  let { api } = setupTestArticleSession({ seed (doc) {
    let bio = doc.create({ type: 'bio' }).append(doc.create({ type: 'p' }))
    doc.create({ type: 'person', id: 'test-person', bio: bio.id })
  }})
  // ATTENTION: this may break easily if the kitchen-sink is changed
  let personModel = api.getModelById('test-person')
  let bio = personModel._getPropertyModel('bio')
  t.ok(bio.isEmpty(), 'bio model should be empty.')
  t.end()
})
