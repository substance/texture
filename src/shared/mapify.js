export default function mapify(collection, propName) {
  let m = new Map()
  for (let item of collection) {
    m.set(item[propName], item)
  }
  return m
}