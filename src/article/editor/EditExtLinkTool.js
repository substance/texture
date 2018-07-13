import { LinkPackage } from 'substance'

const { EditLinkTool } = LinkPackage

export default class EditExtLinkTool extends EditLinkTool {}

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href']