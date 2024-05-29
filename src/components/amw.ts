import { registerComponent } from "../register";
import Grid from "../lib/xor/grid";
import Runtime from "../lib/xor/runtime";
import Thing from "../lib/xor/thing";

const grid = new Grid()
const runtime = new Runtime(grid)
const autoplay = false

registerComponent('amw', ()  => ({
  autoplay: autoplay,
  ticks: 0,
  columns: grid.render(),
  runtime: runtime,
  halted: false,
  play_pause_btn_label: 'Play',
  init() {
    this.runtime.on('tick', ({ ticks }) => { 
      this.ticks = ticks
      this.render()
    })
    this.runtime.on('reset', () => {
      load(runtime)
      this.render()
    })
    load(this.runtime)
    this.render()
    if (this.autoplay) {
      this.runtime.start()
    }
  },
  render() {
    this.halted = runtime.is_halted
    this.columns = grid.render()
    this.play_pause_btn_label = this.runtime.is_running ? 'Pause' : 'Play'
  },
  play_pause() {
    if (runtime.is_running) {
      this.runtime.pause()
    } else {
      this.runtime.tick()
      this.runtime.start()
    }
    this.render()
  },
  step() {
    this.render()
    this.runtime.step()
  },
  reset() {
    this.runtime.reset()
    this.render()
  }
}))

function load(runtime: Runtime) {
  const wizard = new Thing('wizard', '🧙‍♂️')
  runtime.add(wizard)
}
