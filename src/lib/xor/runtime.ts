import Clock from "./clock"
import EventBus from './event_bus'
import Grid from "./grid"
import Thing from './thing'

const MS_PER_CYCLE = 400

export default class Runtime extends EventBus {
  private win = false
  private halted = false
  private ticks = 0
  private clock: Clock
  private grid: Grid
  private things = new Set<Thing>

  get is_halted () { return this.halted; }
  get is_running () { return this.clock.isRunning; }
  get get_ticks () { return this.ticks; }
  get has_won () { return this.win; }

  constructor (grid: Grid) {
    super()
    this.grid = grid
    this.clock = new Clock(MS_PER_CYCLE, this.tick.bind(this))


    this.update()
  }

  add(thing: Thing) {
    this.things.add(thing)
    this.grid.put(thing, thing.pos)
    this.update()
  }

  start() {
    this.clock.start()
  }

  pause() {
    this.clock.stop()
  }

  reset() {
    this.clock.stop()
    this.grid.clear()
    this.things = new Set()
    this.ticks = 0
    this.halted = false
    this.emit('reset', {})
  }

  step() {
    this.tick()
  }

  halt() {
    this.clock.stop()
    this.halted = true
  }

  update() {
    this.grid.each((cell) => cell.update())
  }

  tick () {
    this.things.forEach(thing => {
      if (this.halted) return false
      if (thing.attributes.has('walks')) this.handleWalking(thing)
    })

    this.update()

    this.ticks += 1
    this.emit('tick', { ticks: this.ticks })
  }

  handleWalking (thing: Thing) {
    const src = this.grid.at(thing.pos)
    if (!src) return

    const dest_pos = thing.pos.clone().add(thing.dir)
    const dest = this.grid.at(dest_pos)

    if (!dest) {
      console.warn('no cell!')
      thing.error = true
      this.halt()
      return
    }

    if (dest.has_attribute('blocks')) {
      if (dest.has_attribute('stops')) return
      thing.rotate_left()
      return
    }

    const prev = dest.rm()
    src.rm()
    dest.put(thing)

    if (prev && prev.attributes.has('win')) {
      this.win = true
      thing.win = true
      this.halt()
      return
    }
  }
}
