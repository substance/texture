import { LinkCommand } from 'substance'

class ExtLinkCommand extends LinkCommand {

  getAnnotationData() {
    return {
      attributes: {
        'xlink:href': ''
      }
    }
  }
}

export default ExtLinkCommand
