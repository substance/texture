import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { importElement, exportNode } from './shared/testHelpers'

const DispFormula = `
<disp-formula id="disp-formula-3" content-type="math/tex">
<label>(1)</label>
<tex-math><![CDATA[sqrt(13)]]></tex-math>
</disp-formula>
`

const DispFormulaWithoutCDATA = `
<disp-formula id="disp-formula-3" content-type="math/tex">
  <label>(1)</label>
  <tex-math>sqrt(13)</tex-math>
</disp-formula>
`

test('FormulaConverter: importing', t => {
  let el = DefaultDOMElement.parseSnippet(DispFormula.trim(), 'xml')
  let DispFormulaNode = importElement(el)
  t.equal(DispFormulaNode.id, 'disp-formula-3', 'id should be preserved')
  t.equal(DispFormulaNode.label, '(1)', 'label should be preserved')
  t.equal(DispFormulaNode.content, 'sqrt(13)', 'content should contain tex, but without CDATA section')
  t.end()
})

test('FormulaConverter: exporting', t => {
  let el = DefaultDOMElement.parseSnippet(DispFormula.trim(), 'xml')
  let dispFormulaNode = importElement(el)
  let dispFormulaEl = exportNode(dispFormulaNode)
  t.equal(dispFormulaEl.getOuterHTML(), DispFormula.replace(/\n|\r/g, ''), 'exported element should be equal to imported')
  t.end()
})

test('FormulaConverter: exported tex-math should always contain CDATA', t => {
  let el = DefaultDOMElement.parseSnippet(DispFormulaWithoutCDATA.trim(), 'xml')
  let dispFormulaNode = importElement(el)
  let dispFormulaEl = exportNode(dispFormulaNode)
  let texMathEl = dispFormulaEl.find('tex-math')
  t.equal(texMathEl.getChildCount(), 1, 'tex-math should contain one element')
  t.equal(texMathEl.getFirstChild().nodeType, 'cdata', 'tex-math should contain cdata element')
  t.end()
})
