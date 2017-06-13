export default function getXrefTargets(xref) {
  let idrefs = xref.getAttribute('rid')
  if (idrefs) {
    return idrefs.split(' ')
  } else {
    return []
  }
}