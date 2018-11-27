import { Surface as SubstanceSurface } from 'substance'
import ModifiedSurface from './_ModifiedSurface'

/*
  Overridden version of Substance.Surface with modifications from 'ModifiedSurface'
*/
export default class SurfaceNew extends ModifiedSurface(SubstanceSurface) {}
