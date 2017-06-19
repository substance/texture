import { Configurator, AnnotationCommand, SwitchTextTypeCommand } from 'substance'

export default class TextureConfigurator extends Configurator {

  addAnnotationTool(spec) {
    this.addCommand(spec.name, AnnotationCommand, {
      nodeType: spec.nodeType,
      commandGroup: spec.commandGroup,
    })
    this.addIcon(spec.name, { 'fontawesome': spec.icon })
    this.addLabel(spec.name, spec.label)
    if (spec.accelerator) {
      this.addKeyboardShortcut(spec.accelerator, { command: spec.name })
    }
  }

  addTextTypeTool(spec) {
    this.addCommand(spec.name, SwitchTextTypeCommand, {
      spec: spec.nodeSpec,
      commandGroup: 'text-types'
    })
    this.addIcon(spec.name, { 'fontawesome': spec.icon })
    this.addLabel(spec.name, spec.label)
    if (spec.accelerator) {
      this.addKeyboardShortcut(spec.accelerator, { command: spec.name })
    }

  }

  addInsertTool(spec) {

  }
}