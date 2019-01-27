import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, createTestVfs } from './shared/integrationTestHelpers'

const TWO_GROUPS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
      <contrib-group content-type="author">
        <contrib id="group-82b48e1f5a16997cea0f19c820f933d4" contrib-type="group" equal-contrib="yes" corresp="no">
          <collab>
            <named-content content-type="name">The Mouse Genome Sequencing Consortium</named-content>
            <email>mouse-project@example.com</email>
            <contrib-group contrib-type="group-member">
              <contrib contrib-type="person" equal-contrib="no" corresp="no" deceased="no">
                <name>
                  <surname>Kelly</surname>
                  <given-names>Laura A.</given-names>
                </name>
              </contrib>
            </contrib-group>
          </collab>
        </contrib>
      </contrib-group>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>
`

test('Input: ManyRelationship dropdown', t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(TWO_GROUPS),
    archiveId: 'test'
  })
  let metadataEditor = openMetadataEditor(app)
  // ATTENTION: just taking the first ManyRelationshipInput we find
  let manyRelationship = metadataEditor.find('.sc-many-relationship')
  let selectInput = manyRelationship.find('.sm-person .sm-group .sc-many-relationship .sc-multi-select-input')
  t.ok(selectInput.el.is('.sm-collapsed'), 'the dropdown should be collapsed in the beginning')
  // click on the input to open the dropdown
  selectInput.el.click()
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should be expanded')
  let item = selectInput.find('.se-select-item.sm-selected')
  item.click()
  // we want that the dropdown remains open
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should still be expanded')
  // and the specific item should be selected now
  // Note: better to get the item again, in case that the drop down get rendered from scratch
  item = selectInput.find('.se-select-item')
  let isSelected = item.el.is('.sm-selected')
  t.notOk(isSelected, 'the item selection should have changed')
  t.end()
})
