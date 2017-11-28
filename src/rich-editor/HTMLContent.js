import { DocumentNode } from 'substance'

class HTMLContent extends DocumentNode {}

HTMLContent.schema = { type: 'html-content', content: 'text' }

export default HTMLContent
