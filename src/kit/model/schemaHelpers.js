export const STRING = { type: 'string', default: '' }

export const BOOLEAN = { type: 'boolean', default: false }

export function MANY (...targetTypes) {
  return { type: ['array', 'id'], targetTypes, default: [] }
}

export function ONE (...targetTypes) {
  return { type: 'id', targetTypes, default: null }
}

export function CHILDREN (...targetTypes) {
  return { type: ['array', 'id'], targetTypes, default: [], owned: true }
}
