import { EditLinkTool } from 'substance'

class EditExtLinkTool extends EditLinkTool {}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']

export default EditExtLinkTool
