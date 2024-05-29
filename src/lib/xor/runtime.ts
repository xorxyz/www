import Clock from "./clock"
import EventBus from './event_bus'
import Grid from "./grid"
import Thing from './thing'

const MS_PER_CYCLE = 1000

export default class Runtime extends EventBus {
  private ticks = 0
  private clock: Clock
  private grid: Grid
  private things = new Set<Thing>

  get get_ticks () { return this.ticks; }

  constructor (grid: Grid) {
    super()
    this.grid = grid
    this.clock = new Clock(MS_PER_CYCLE, this.tick.bind(this))
    const wizard = new Thing('wizard', '@')
    this.things.add(wizard)
    this.grid.put(wizard, wizard.pos)

    this.clock.start()
  }

  tick () {
    this.ticks += 1
    this.emit('tick', { ticks: this.ticks })
    this.things.forEach(thing => {
      const cell = this.grid.at(thing.pos)
    
      const next_pos = thing.pos.clone().add(thing.dir)
      const next = this.grid.at(next_pos)
      next?.put(thing)
      cell?.rm()
      
      console.log(thing.pos.label, next_pos.label, next)
      // console.log(thing)
    })
  }
}
