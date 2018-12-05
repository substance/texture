import { test } from 'substance-test'
import { NumberedLabelGenerator } from '../index'

test('LabelGenerator: numbered labels', t => {
  let generator = new NumberedLabelGenerator({
    template: '[$]',
    and: ',',
    to: '-'
  })
  let label = generator.getLabel([3, 4, 2, 5, 1, 6, 10, 9, 8, 7])
  t.equal(label, '[1-10]')
  t.end()
})
