/**
 * Creates a new Map instance with changed order.
 * Left-out properties are appended in the original order.
 *
 * @param {Map} m a Map instance to be re-ordered
 * @param {string[]} props names of properties that should be picked first.
 */
export default function mapWithChangedOrder (m, props) {
  let names = new Set(m.keys())
  let result = new Map()
  props.forEach(name => {
    result.set(name, m.get(name))
    names.delete(name)
  })
  names.forEach(name => {
    result.set(name, m.get(name))
  })
  return result
}
