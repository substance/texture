import { PropertyAnnotation, Fragmenter } from 'substance'

class Emphasis extends PropertyAnnotation {}

Emphasis.type = "emphasis"

// hint for rendering in presence of overlapping annotations
Emphasis.fragmentation = Fragmenter.ANY

export default Emphasis
