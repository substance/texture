import { getLabel } from './nodeHelpers'

// left side: node type
// right side: ref-type
export const REF_TYPES = {
  'block-formula': 'formula',
  'figure': 'fig',
  'footnote': 'fn',
  'refererence': 'bibr',
  'table-figure': 'table',
  'supplementary-file': 'file'
}

// left side: ref-type
// right side: [... node types]
export const XREF_TARGET_TYPES = Object.keys(REF_TYPES).reduce((m, type) => {
  const refType = REF_TYPES[type]
  if (!m[refType]) m[refType] = []
  m[refType].push(type)
  return m
}, {
  'table-fn': ['footnote']
})

export function getXrefTargets (xref) {
  return xref.refTargets
}

export function getXrefLabel (xref) {
  return getLabel(xref)
}
