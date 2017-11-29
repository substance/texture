import { DocumentNode } from 'substance'

class Body extends DocumentNode {}

Body.schema = { type: 'body', content: 'text' }

export default Body
