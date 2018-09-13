import { test } from 'substance-test'
import setupTestArticleSession from './setupTestArticleSession'

test('Model: model.isEmpty() for empty containers', t => {
  let { api } = setupTestArticleSession()
  let bodyModel = api.getModelById('body')
  t.ok(bodyModel.isEmpty(), 'body model should be empty.')
  t.end()
})
