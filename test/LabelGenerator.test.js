import { test } from 'substance-test'
import { NumberedLabelGenerator, FigureLabelGenerator } from '../index'

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

test('LabelGenerator: figure labels', t => {
  let generator = new FigureLabelGenerator()
  // empty of invalid
  t.equal(generator.getLabel(), '???', 'empty label should be correct')
  // simple labels
  t.equal(generator.getLabel({pos: 1}), 'Figure 1', 'label for simple figure should be correct')
  t.equal(generator.getLabel({pos: 2}), 'Figure 2', 'label for simple figure should be correct')
  t.equal(generator.getLabel([{pos: 1}, {pos: 1}]), 'Figure 1A', 'label for sub-figure should be correct')
  t.equal(generator.getLabel([{pos: 2}, {pos: 3}]), 'Figure 2C', 'label for sub-figure should be correct')
  // combined labels
  t.equal(generator.getLabel({pos: 1}, {pos: 2}, {pos: 3}), 'Figures 1‒3', 'label for range of figures should be correct')
  t.equal(generator.getLabel({pos: 2}, {pos: 1}, {pos: 3}), 'Figures 1‒3', 'label for shuffled range of figures should be correct')
  t.equal(generator.getLabel([{pos: 1}, {pos: 2}], [{pos: 1}, {pos: 3}], [{pos: 1}, {pos: 4}]), 'Figures 1B‒D', 'label for range of sub-figures should be correct')
  t.equal(generator.getLabel([{pos: 1}, {pos: 2}], [{pos: 1}, {pos: 4}], [{pos: 1}, {pos: 3}]), 'Figures 1B‒D', 'label for shuffeled range of sub-figures should be correct')
  t.equal(generator.getLabel({pos: 1}, {pos: 3}, {pos: 5}), 'Figures 1, 3, and 5', 'label for multiple figures should be correct')
  t.equal(generator.getLabel({pos: 3}, {pos: 5}, {pos: 1}), 'Figures 1, 3, and 5', 'label for multiple shuffled figures should be correct')
  t.equal(generator.getLabel({pos: 1}, {pos: 2}, [{pos: 3}, {pos: 1}], {pos: 4}), 'Figures 1‒2, 3A, and 4', 'label for figures and panels should be correct')
  t.end()
})
