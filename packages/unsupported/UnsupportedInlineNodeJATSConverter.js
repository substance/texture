import UnsupportedNodeJATSConverter from './UnsupportedNodeJATSConverter'

export default {

  type: 'unsupported-inline',

  matchElement: function() {
    return true;
  },

  import: UnsupportedNodeJATSConverter.import,
  export: UnsupportedNodeJATSConverter.export

}
