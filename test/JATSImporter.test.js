import { test } from 'substance-test'
import { createEmptyJATS, jats2internal } from '../index'

// TODO: add more tests covering the implementation of jats2internal

test('JATSImporter: article-record permission', t => {
  // empty JATS
  let jats = createEmptyJATS()
  let doc = jats2internal(jats)
  let articleRecord = doc.get('article-record')
  let permission = doc.get(articleRecord.permission)
  t.ok(articleRecord === permission.getParent(), 'article permission should have article-record as parent')

  // with article-meta > permissions
  jats = createEmptyJATS()
  let $$ = jats.createElement.bind(jats)
  jats.find('article-meta').append(
    $$('permissions').append(
      $$('copyright-statement').text('abc'),
      $$('copyright-year').text('2018'),
      $$('copyright-holder').text('J. Doe'),
      $$('license_ref').text('foo'),
      $$('license').append(
        $$('p').text('lorem ipsum')
      )
    )
  )
  doc = jats2internal(jats)
  articleRecord = doc.get('article-record')
  permission = doc.get(articleRecord.permission)
  t.ok(articleRecord === permission.getParent(), 'article permission should have article-record as parent')

  t.end()
})
