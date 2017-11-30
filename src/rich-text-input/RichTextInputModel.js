import { PropertyAnnotation, Fragmenter, DocumentNode } from 'substance'

export class Body extends DocumentNode {}
Body.schema = { type: 'body', content: 'text' }
export default Body

export class Strong extends PropertyAnnotation {}
Strong.type = "strong"
Strong.fragmentation = Fragmenter.ANY

export class Subscript extends PropertyAnnotation {}
Subscript.type = "subscript"
Subscript.fragmentation = Fragmenter.ANY

export class Superscript extends PropertyAnnotation {}
Superscript.type = "superscript"
Superscript.fragmentation = Fragmenter.ANY

export class Emphasis extends PropertyAnnotation {}
Emphasis.type = "emphasis"
Emphasis.fragmentation = Fragmenter.ANY
