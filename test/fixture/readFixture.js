import vfs from '../../tmp/test-vfs'

export default function readFixture (fileName) {
  let fixture = vfs.readFileSync(`test/fixture/${fileName}`)
  return fixture
}
