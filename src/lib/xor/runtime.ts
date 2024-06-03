import Cell from "./cell"
import Clock from "./clock"
import EventBus from './event_bus'
import Grid from "./grid"
import Thing from './thing'
import Vector from "./vector"

const MS_PER_CYCLE = 400

export default class Runtime extends EventBus {
  private win = false
  private halted = false
  private executing = false
  private ticks = 0
  private clock: Clock
  private grid: Grid
  private things = new Set<Thing>

  get is_halted () { return this.halted; }
  get is_running () { return this.clock.isRunning || this.executing; }
  get get_ticks () { return this.ticks; }
  get has_won () { return this.win; }

  constructor (grid: Grid) {
    super()
    this.grid = grid
    this.clock = new Clock(MS_PER_CYCLE, this.tick.bind(this))

    this.update()
  }

  add(thing: Thing) {
    if (!this.grid.at(thing.pos)?.is_empty) return
    this.things.add(thing)
    this.grid.put(thing, thing.pos, !this.is_running)
    this.update()
  }

  move(from: Vector, to: Vector) {
    this.grid.move(from, to, !this.is_running)
    this.update()
  }

  remove(thing: Thing) {
    this.grid.remove(thing.pos)
    this.things.delete(thing)
    this.update()
  }

  remove_at(v: Vector) {
    const thing = this.grid.remove(v)

    if (thing) this.remove(thing)
    this.update()
  }

  start() {
    this.clock.start()
  }

  pause() {
    this.clock.stop()
  }

  reset() {
    const old_state = [...this.things.values()].filter(thing => !thing.fixed)
    this.clock.stop()
    this.grid.clear()
    this.things = new Set()
    old_state.forEach(thing => this.add(thing.reset()))
    this.ticks = 0
    this.halted = false
    this.win = false
    this.emit('reset')
  }

  step() {
    this.tick()
  }

  halt() {
    this.clock.stop()
    this.halted = true
    this.update()
  }

  update() {
    this.grid.each((cell) => cell.updateOutput())
    this.emit('update')
  }

  tick () {
    this.executing = true
    this.emit('update')
    this.things.forEach(thing => {
      if (this.halted) return false
      if (thing.attributes.has('walks') && !thing.error) this.handleWalking(thing)
    })

    this.grid.each((cell) => cell.updateThing())
    this.update()

    this.ticks += 1
    this.executing = false
    this.emit('tick', { ticks: this.ticks })
  }

  handleWalking (thing: Thing) {
    const src = this.grid.at(thing.pos)
    if (!src) return

    const facing = this.grid.at(thing.facing())
    if (facing && thing.attributes.has('eats') && facing.handlers.has(thing) && facing.has_attribute('edible')) {
      if (thing.attributes.has('eating')) return
      const edible = facing.rm()
      if (!edible) return
      const icon = edible.icon
      thing.attributes.add('eating')

      const EATING_DURATION = 2
      const GROWTH_DELAY = 5

      edible.schedule_delayed_effect('eat', EATING_DURATION, () => {
        thing.attributes.delete('eating')
        edible.attributes.delete('edible')
        edible.attributes.delete('attracts')
        edible.icon = '--'
      })
      edible.schedule_delayed_effect('grow', EATING_DURATION + GROWTH_DELAY, () => {
        edible.icon = icon
        edible.attributes.add('edible')
        edible.attributes.add('attracts')
      })
      facing.put(edible, false)
      return
    }

    if ([...this.things.values()].some(thing => thing.attributes.has('attracts'))) {
      const changed_dir = this.handleAttraction(thing)
      if (changed_dir) {
        return
      }
    }

    const dest_pos = thing.pos.clone().add(thing.dir)
    const dest = this.grid.at(dest_pos)

    if (!dest) {
      thing.error = true
      if (thing.name === 'wizard') {
        this.halt()
      }
      return
    }

    if (dest.has_attribute('blocks')) {
      if (dest.has_attribute('halts')) {
        thing.error = true
        if (thing.name === 'wizard') {
          this.halt()
        }
        return
      }
      const prev_dir = thing.dir.clone()
      thing.rotate_left()
      this.grid.update_handlers(thing, src, src, prev_dir)
      return
    }

    const prev = dest.rm()
    if (prev && prev.attributes.has('collectible')) {
      // this.remove(prev)  
    } else {
      dest.buffer = prev
    }

    this.move(thing.pos, dest_pos)

    if (prev && prev.attributes.has('win')) {
      this.win = true
      thing.win = true
      this.halt()
      return
    }

  }

  // - build a list of 4 lists of cells
  // - first is all cells i'm facing, then to my right, behind, and left
  // - iterate over each list
  // - if i encounter something blocking, drop the list
  // - if i encounter something attractive, fixate on it
  // - if i'm facing it, continue
  // - if not, face it, and stop the turn
  handleAttraction (thing: Thing) {
    let lines = this.grid.list_orthogonal_cells(thing.pos, thing.dir)
    let done = false
    let target

    while (!done) {
      for (let line of lines) {
        const cell = line.shift()
        if (!cell || cell.has_attribute('blocks')) {
          line.length = 0
          continue
        }
        if (cell.has_attribute('attracts')) {
          if (thing.name === 'wizard' && !cell.has_attribute('attracts:wizard')) continue
          if (thing.name === 'sheep' && !cell.has_attribute('attracts:sheep')) continue
          done = true
          target = cell
          break          
        }
      }
      lines = lines.filter(line => line.length)
      if (!lines.length) {
        done = true
      }
    }

    if (target) {
      const prev_dir = thing.dir.clone()
      const distance_vector = target.pos.clone().sub(thing.pos)
      const next_dir = distance_vector.div(distance_vector.clone().absolute())
      if (next_dir.equals(prev_dir)) return false
      // face the new direction
      thing.dir.copy(next_dir)
      const cell = this.grid.at(thing.pos) as Cell
      this.grid.update_handlers(thing, cell, cell, prev_dir)
      return true
    } else {
      return false
    }
  }
}
