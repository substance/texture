import AuthorExamplePackage from '../author/package'

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
    // aff
    config.addCommand('tag-aff', TagAffCommand);
    config.addTool('tag-aff', TagAffTool);
    config.addIcon('tag-aff', { 'fontawesome': 'fa-bullseye' });
    // ref
    config.addCommand('tag-ref', TagRefCommand);
    config.addTool('tag-ref', TagRefTool);
    config.addIcon('tag-ref', { 'fontawesome': 'fa-bullseye' });
    //contrib
    config.addCommand('tag-contrib', TagContribCommand);
    config.addTool('tag-contrib', TagContribTool);
    config.addIcon('tag-contrib', { 'fontawesome': 'fa-bullseye' });
  }
};
