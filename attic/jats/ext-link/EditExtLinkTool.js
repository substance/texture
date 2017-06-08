import { LinkPackage } from 'substance'

class EditExtLinkTool extends LinkPackage.EditLinkTool {}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']

export default EditExtLinkTool
