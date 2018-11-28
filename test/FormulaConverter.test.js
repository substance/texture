import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import {
  InternalArticleDocument, InternalArticleSchema,
  createJatsImporter, createJatsExporter, createEmptyJATS
} from '../index'

const DispFormula = `
<disp-formula id="disp-formula-3">
<label>(1)</label>
<tex-math><![CDATA[sqrt(13)]]></tex-math>
</disp-formula>
`

const DispFormulaWithoutLabel = `
<disp-formula id="disp-formula-3">
  <tex-math><![CDATA[
1+\frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots=
\prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}, 
\quad\quad \text{for }\lvert q\rvert<1.]]></tex-math>
</disp-formula>
`

const DispFormulaWithoutCDATA = `
<disp-formula id="disp-formula-3">
  <label>(1)</label>
  <tex-math>\sqrt(13)</tex-math>
</disp-formula>
`

const TexMathWithId = `<tex-math>\sqrt(13)</tex-math>`

test('DispFormulaConverter: import', t => {
  let el = DefaultDOMElement.parseSnippet(DispFormula.trim(), 'xml')
  let DispFormulaNode = _importElement(el)
  t.equal(DispFormulaNode.id, 'disp-formula-3', 'id should be preserved')
  t.equal(DispFormulaNode.label, '(1)', 'label should be preserved')
  t.equal(DispFormulaNode.content, 'sqrt(13)', 'content should contain tex, but without CDATA section')
  t.end()
})

test('DispFormulaConverter: export', function (t) {
  let el = DefaultDOMElement.parseSnippet(DispFormula.trim(), 'xml')
  let DispFormulaNode = _importElement(el)
  let DispFormulaEl = _exportElement(DispFormulaNode)
  t.equal(DispFormulaEl.getOuterHTML(), DispFormula.replace(/\n|\r/g, ''), 'exported element should be equal to imported')
  t.end()
})

function _importElement (el) {
  let doc = InternalArticleDocument.createEmptyArticle(InternalArticleSchema)
  let importer = createJatsImporter(doc)
  return importer.convertElement(el)
}

function _exportElement (el) {
  let jats = createEmptyJATS()
  let exporter = createJatsExporter(jats, el.getDocument())
  return exporter.convertNode(el)
}