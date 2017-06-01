import { Container } from 'substance'

class ContribGroup extends Container {}

ContribGroup.type = "contrib-group"

ContribGroup.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
})

export default ContribGroup
