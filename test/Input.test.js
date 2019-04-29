import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, createTestVfs } from './shared/integrationTestHelpers'
import { DEFAULT_JATS_SCHEMA_ID, DEFAULT_JATS_DTD } from '../index'

const AUTHOR_AND_GROUP = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
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

// Note: using Author + Group here
test('Input: SinlgeRelationship dropdown', t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(AUTHOR_AND_GROUP),
    archiveId: 'test'
  })
  let metadataEditor = openMetadataEditor(app)
  let selectInput = metadataEditor.find('.sm-person .sm-group .sc-single-relationship .sc-multi-select-input')
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
  t.notOk(item.el.is('.sm-selected'), 'item should not be checked')
  // toggle again
  item.click()
  item = selectInput.find('.se-select-item')
  t.ok(item.el.is('.sm-selected'), 'item should be checked')
  t.end()
})

const AUTHOR_AND_TWO_AFFS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
      <contrib-group content-type="author">
        <contrib contrib-type="person" equal-contrib="yes" corresp="yes" deceased="no">
          <name>
            <surname>Doe</surname>
            <given-names>John</given-names>
          </name>
          <email>john.doe@university</email>
          <xref ref-type="aff" rid="aff1" />
          <xref ref-type="aff" rid="aff2" />
        </contrib>
      </contrib-group>
      <aff id="aff1">
        <institution content-type="orgname">German Primate Center GmbH</institution>
        <institution content-type="orgdiv1">Neurobiology Laboratory</institution>
        <city>Göttingen</city>
        <country>Germany</country>
      </aff>
      <aff id="aff2">
        <institution content-type="orgname">The Rockefeller University</institution>
        <institution content-type="orgdiv1">Laboratory of Neural Systems</institution>
        <city>New York</city>
        <country>United States</country>
      </aff>
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
    vfs: createTestVfs(AUTHOR_AND_TWO_AFFS),
    archiveId: 'test'
  })
  let metadataEditor = openMetadataEditor(app)
  let selectInput = metadataEditor.find('.sm-person .sm-affiliations .sc-many-relationship .sc-multi-select-input')
  t.ok(selectInput.el.is('.sm-collapsed'), 'the dropdown should be collapsed in the beginning')
  // click on the input to open the dropdown
  selectInput.click()
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should be expanded')
  let items = selectInput.findAll('.se-select-item')
  t.equal(items.length, 2, 'there should be two items to select')
  let first = items[0]
  // toggle the first
  first.click()
  // we want that the dropdown remains open
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should still be expanded')
  // and the specific item should be selected now
  t.notOk(first.el.is('.sm-selected'), 'item should not be checked')
  // toggle again
  first.click()
  t.ok(first.el.is('.sm-selected'), 'item should be checked')
  t.end()
})
