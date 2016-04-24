'use strict';

var Controller = require('substance/ui/Controller');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Icon = require('substance/ui/FontAwesomeIcon');
var Toolbar = require('substance/ui/Toolbar');
var Layout = require('substance/ui/Layout');
var UndoTool = require('substance/ui/UndoTool');
var RedoTool = require('substance/ui/RedoTool');
var SwitchTextTypeTool = require('substance/packages/text/SwitchTextTypeTool');
var StrongTool = require('substance/packages/strong/StrongTool');
var EmphasisTool = require('substance/packages/emphasis/EmphasisTool');
var LinkTool = require('substance/packages/link/LinkTool');

function ScientistWriter() {
  Controller.apply(this, arguments);
}

ScientistWriter.Prototype = function() {

  // Custom Render method for your editor
  this.render = function($$) {
    var config = this.getConfig();
    return $$('div').addClass('sc-scientist-writer').append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        // Top area (toolbar)
        $$('div').addClass('se-toolbar-wrapper').append(
          $$(Layout, {width: 'large', noPadding: true}).append(
            $$(Toolbar).append(
              $$(Toolbar.Group).append(
                $$(SwitchTextTypeTool, {'title': this.i18n.t('switch_text')}),
                $$(UndoTool).append($$(Icon, {icon: 'fa-undo'})),
                $$(RedoTool).append($$(Icon, {icon: 'fa-repeat'})),
                $$(StrongTool).append($$(Icon, {icon: 'fa-bold'})),
                $$(EmphasisTool).append($$(Icon, {icon: 'fa-italic'})),
                $$(LinkTool).append($$(Icon, {icon: 'fa-link'}))
              )
            )
          )
        ),
        // Bottom area (content)
        $$(ScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'right'
        }).append(
          $$(Layout, {
            width: 'large'
          }).append(
            $$(ContainerEditor, {
              doc: this.props.documentSession.doc,
              containerId: 'body',
              name: 'bodyEditor',
              commands: config.bodyEditor.commands,
              textTypes: config.bodyEditor.textTypes
            }).ref('bodyEditor')
          )
        ).ref('scrollableContent')
      )
    );
  };
};

Controller.extend(ScientistWriter);

ScientistWriter.static.config = {
  // Controller specific configuration (required!)
  controller: {
    // Component registry
    components: {
      'paragraph': require('substance/packages/paragraph/ParagraphComponent'),
      'heading': require('substance/packages/heading/HeadingComponent'),
      'image': require('substance/packages/image/ImageComponent'),
      'link': require('substance/packages/link/LinkComponent'),
      'codeblock': require('substance/packages/codeblock/CodeblockComponent'),
      'blockquote': require('substance/packages/blockquote/BlockquoteComponent'),
      'inline-figure': require('./FigureComponent'),
      'reference': require('./ReferenceComponent'),
      'caption': require('./CaptionComponent'),
      'graphic': require('./GraphicComponent'),
      // 'unsupported-inline': require('./ExpandableComponent'),
      'unsupported-inline': require('./UnsupportedInlineNodeComponent'),
      'unsupported-block': require('./UnsupportedBlockNodeComponent')
    },
    // Controller commands
    commands: [
      require('substance/ui/UndoCommand'),
      require('substance/ui/RedoCommand'),
      require('substance/ui/SaveCommand')
    ]
  },
  // Custom configuration (required!)
  bodyEditor: {
    commands: [
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/link/LinkCommand')
    ],
    textTypes: [
      {name: 'paragraph', data: {type: 'paragraph'}},
      {name: 'heading1',  data: {type: 'heading', level: 1}},
      {name: 'heading2',  data: {type: 'heading', level: 2}},
      {name: 'heading3',  data: {type: 'heading', level: 3}},
      {name: 'codeblock', data: {type: 'codeblock'}},
      {name: 'blockquote', data: {type: 'blockquote'}}
    ]
  }
};

module.exports = ScientistWriter;