import { registerComponent } from '../register'

export * from './circuit_builder'
export * from './program_editor'
import amw from './amw'

registerComponent('amw', amw)