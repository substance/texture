import AuthorExamplePackage from '../author/package'
import { ToolDropdown } from 'substance'
import TagAffCommand from './aff/TagAffCommand'
import TagAffTool from './aff/TagAffTool'
import TagRefCommand from './ref/TagRefCommand'
import TagRefTool from './ref/TagRefTool'
import TagContribCommand from './contrib/TagContribCommand'
import TagContribTool from './contrib/TagContribTool'

export default {
  name: 'tagging-example',
  configure: function(config) {
    config.import(AuthorExamplePackage)

    // Tagging
    // -------

    // Needed by TextureToolbar (lookup via tool-target-{targetname})
    config.addComponent('tool-target-tag', ToolDropdown);
    config.addIcon('tool-target-tag', { 'fontawesome': 'fa-bullseye' });

    // aff
    config.addCommand('tag-aff', TagAffCommand);
    config.addTool('tag-aff', TagAffTool, {target: 'tag'});
    config.addIcon('tag-aff', { 'fontawesome': 'fa-bullseye' });
    // ref
    config.addCommand('tag-ref', TagRefCommand);
    config.addTool('tag-ref', TagRefTool, {target: 'tag'});

    config.addIcon('tag-ref', { 'fontawesome': 'fa-bullseye' });
    config.addLabel('tag-ref', 'Reference');
    //contrib
    config.addCommand('tag-contrib', TagContribCommand);
    config.addTool('tag-contrib', TagContribTool, {target: 'tag'});
    config.addIcon('tag-contrib', { 'fontawesome': 'fa-bullseye' });
  }
};

