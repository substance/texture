import { test } from 'substance-test'
import { createEmptyJATS, createJatsImporter } from 'substance-texture'

// TODO: add more tests covering the implementation of ArticleJATSImporter

// TODO: this test looks a bit 'arbitrary'. It could be more targeted, addressing a specifc issue
// or it should be generalized introducing a concept for general import/export testing
test('JATSImporter: article-record permission', t => {
  let jats = createEmptyJATS()
  let importer = createJatsImporter()
  let doc = importer.import(jats)
  let metadata = doc.get('metadata')
  let permission = metadata.resolve('permission')

  // TODO is this test just checking the integrity of child - parent?
  // then this test should be removed, and the ParentNode.test in substance should be hardened
  t.ok(metadata === permission.getParent(), 'article permission should have metadata as parent')

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
  importer.reset()
  doc = importer.import(jats)
  metadata = doc.get('metadata')
  permission = metadata.resolve('permission')
  t.ok(metadata === permission.getParent(), 'article permission should have article-record as parent')

  t.end()
})
