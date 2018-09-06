import { HandlerParams, last } from 'substance'
import CommandManager from './CommandManager'

const DISABLED = Object.freeze({
  disabled: true
})

/*
  Experimental CommandManager that makes use of the XML schema
  to inhibit commands which are not allowed at the current position.
*/
export default class SchemaDrivenCommandManager extends CommandManager {
  constructor (...args) {
    super(...args)

    this._initialize()
  }

  _initialize () {
    // EXPERIMENTAL: categorizing commands to be able to disable commands according to schema rules
    const annotationCommands = []
    const insertCommands = []
    const switchTypeCommands = []
    const otherCommands = []
    this.commands.forEach(command => {
      if (command.isAnnotationCommand()) {
        annotationCommands.push(command)
      } else if (command.isInsertCommand()) {
        insertCommands.push(command)
      } else if (command.isSwitchTypeCommand()) {
        switchTypeCommands.push(command)
      } else {
        otherCommands.push(command)
      }
    })
    this._annotationCommands = annotationCommands
    this._insertCommands = insertCommands
    this._switchTypeCommands = switchTypeCommands
    this._otherCommands = otherCommands
  }

  _getCommandStates () {
    const context = this.contextProvider.context
    const appState = context.appState
    const params = new HandlerParams(context)
    const doc = appState.document
    const sel = appState.selection
    const selectionState = appState.selectionState
    const isBlurred = appState.isBlurred
    const noSelection = !sel || sel.isNull() || !sel.isAttached()

    const commandStates = {}
    // all editing commands are disabled if
    // - this editorSession is blurred,
    // - or the selection is null,
    // - or the selection is inside a custom editor
    if (isBlurred || noSelection || sel.isCustomSelection()) {
      Object.assign(commandStates,
        _disabled(this._annotationCommands),
        _disabled(this._insertCommands),
        _disabled(this._switchTypeCommands)
      )
    } else {
      const path = sel.start.path
      const node = doc.get(path[0])

      // TODO: is this really necessary. It rather seems to be
      // a workaround for other errors, i.e., the selection pointing
      // to a non existing node
      // If really needed we should document why, and in which case.
      if (!node) {
        // FIXME: explain when this happens.'
        throw new Error('FIXME: explain when this happens')
      }

      const isInsideText = node.isText()

      // annotations can only be applied on PropertySelections inside
      // text, and not on an inline-node
      if (isInsideText && sel.isPropertySelection() && !selectionState.isInlineNodeSelection) {
        let path = sel.getPath()
        let propName = last(path)
        let nodeProp = node.getSchema().getProperty(propName)
        let targetTypes = nodeProp.targetTypes || []
        Object.assign(commandStates, _disabledIfDisallowedTargetType(this._annotationCommands, targetTypes, params, context))
      } else {
        Object.assign(commandStates, _disabled(this._annotationCommands))
      }

      // for InsertCommands the selection must be inside a ContainerEditor
      let parentNode = node.parentNode
      if (parentNode && parentNode.isContainer()) {
        let path = parentNode.getContentPath()
        let propName = last(path)
        let nodeProp = parentNode.getSchema().getProperty(propName)
        let targetTypes = nodeProp.targetTypes || []
        Object.assign(commandStates, _disabledIfDisallowedTargetType(this._insertCommands, targetTypes, params, context))
      } else {
        Object.assign(commandStates, _disabled(this._insertCommands))
      }

      // SwitchTypeCommands can only be applied to
      // block-level text nodes
      if (parentNode && sel.containerId && isInsideText && parentNode.isContainer()) {
        let path = parentNode.getContentPath()
        let propName = last(path)
        let nodeProp = parentNode.getSchema().getProperty(propName)
        let targetTypes = nodeProp.targetTypes || []
        Object.assign(commandStates, _disabledIfDisallowedTargetType(this._switchTypeCommands, targetTypes, params, context))
      } else {
        Object.assign(commandStates, _disabled(this._switchTypeCommands))
      }
    }

    // other commands must check their own preconditions
    Object.assign(commandStates, _getCommandStates(this._otherCommands, params, context))

    return commandStates
  }
}

function _disabled (commands) {
  return commands.reduce((m, c) => {
    m[c.getName()] = DISABLED
    return m
  }, {})
}

function _disabledIfDisallowedTargetType (commands, targetTypes, params, context) {
  return commands.reduce((m, cmd) => {
    const type = cmd.getType()
    const name = cmd.getName()
    if (targetTypes.indexOf(type) > -1) {
      m[name] = cmd.getCommandState(params, context)
    } else {
      m[name] = DISABLED
    }
    return m
  }, {})
}

function _getCommandStates (commands, params, context) {
  return commands.reduce((m, command) => {
    m[command.getName()] = command.getCommandState(params, context)
    return m
  }, {})
}
