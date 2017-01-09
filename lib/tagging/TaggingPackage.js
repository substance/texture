import { Tool } from 'substance'
import TagAffCommand from './aff/TagAffCommand'
import TagRefCommand from './ref/TagRefCommand'
import TagContribCommand from './contrib/TagContribCommand'

export default {
  name: 'tagging-example',
  configure: function(config) {

    // Tagging
    // -------

    // Needed by TextureToolbar (lookup via tool-target-{targetname})
    // config.addComponent('tool-target-tag', ToolDropdown)
    config.addToolGroup('tag')
    config.addIcon('tool-target-tag', { 'fontawesome': 'fa-bullseye' })
    config.addLabel('tag', 'Tag')

    // aff
    config.addCommand('tag-aff', TagAffCommand)
    config.addTool('tag-aff', Tool, {toolGroup: 'tag'})
    config.addIcon('tag-aff', { 'fontawesome': 'fa-bullseye' })
    config.addLabel('tag-aff', 'Affiliation')

    // ref
    config.addCommand('tag-ref', TagRefCommand)
    config.addTool('tag-ref', Tool, {toolGroup: 'tag'})

    config.addIcon('tag-ref', { 'fontawesome': 'fa-bullseye' })
    config.addLabel('tag-ref', 'Reference')

    //contrib
    config.addCommand('tag-contrib', TagContribCommand)
    config.addTool('tag-contrib', Tool, {toolGroup: 'tag'})
    config.addIcon('tag-contrib', { 'fontawesome': 'fa-bullseye' })
    config.addLabel('tag-contrib', 'Author')
  }
}
