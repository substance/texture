export default function getXrefTargets(xref) {
  let targetsString = xref.attributes.rid
  if (targetsString) {
    return targetsString.split(' ')
  } else {
    return []
  }
}