import getAvailableXrefTargets from './getAvailableXrefTargets'

export function getXrefTargets(xref) {
  let targetsString = xref.attributes.rid
  if (targetsString) {
    return targetsString.split(' ')
  } else {
    return []
  }
}

export { getAvailableXrefTargets }