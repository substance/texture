import { PropertyAnnotation, Fragmenter } from 'substance'

class Superscript extends PropertyAnnotation {}

Superscript.type = "superscript"

// hint for rendering in presence of overlapping annotations
Superscript.fragmentation = Fragmenter.ANY

export default Superscript
