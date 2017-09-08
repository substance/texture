import { uniq } from 'substance'
import { PUB_ID_TYPES } from '../constants'

export default function getAvailablePubIdTypes() {
  let result = []
  Object.keys(PUB_ID_TYPES).forEach((pubType) => {
    result = result.concat(PUB_ID_TYPES[pubType])
  })
  return uniq(result)
}
