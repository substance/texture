export const extractInitials = givenNames => {
  return givenNames.split(' ').map(part => {
    return part[0] ? part[0].toUpperCase() : ''
  }).join('')
}
