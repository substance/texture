export { test, spy, wait, getMountPoint, testAsync } from 'substance-test'

export function _async (fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
