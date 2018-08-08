export default function createComponentContext (config) {
  return {
    componentRegistry: config.getComponentRegistry(),
    toolRegistry: config.getToolRegistry(),
    labelProvider: config.getLabelProvider(),
    iconProvider: config.getIconProvider()
  }
}
