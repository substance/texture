import { PropertyAnnotation, Fragmenter } from 'substance'

class Strong extends PropertyAnnotation {}

Strong.type = "strong"

// hint for rendering in presence of overlapping annotations
Strong.fragmentation = Fragmenter.ANY

export default Strong
