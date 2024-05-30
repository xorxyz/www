import { registerComponent } from "../register";
import Grid from "../lib/xor/grid";
import Runtime from "../lib/xor/runtime";
import Thing from "../lib/xor/thing";

const grid = new Grid(8, 8)
const runtime = new Runtime(grid)
const autoplay = false

registerComponent('amw', ()  => ({
  autoplay: autoplay,
  ticks: 0,
  columns: grid.render(),
  runtime: runtime,
  halted: false,
  win: false,
  selected: {
    x: 0,
    y: 0
  },
  border_style: '',
  thing_types: [{ name: 'tree', icon: '🌲' }, { name: 'mountain', 'icon': '⛰️'}],
  play_pause_btn_label: 'Play',
  get won() {
    return this.halted && this.win
  },
  get lost() {
    return this.halted && !this.win
  },
  select(e) {
    console.log(e)
  },
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
    this.win = runtime.has_won
    this.columns = grid.render()
    this.play_pause_btn_label = this.runtime.is_running ? 'Pause' : 'Play'
    this.border_style = this.lost ? 'border-red-500' : this.won ? 'border-green-500' : ''
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
  const wizard = new Thing('wizard', '🧙‍♂️', ['walks'])
  runtime.add(wizard)
  
  const flag = new Thing('flag', '🚩', ['win'])
  flag.pos.setXY(6, 4)
  runtime.add(flag)
  
  const tree = new Thing('tree', '🌲', ['blocks'])
  tree.pos.setXY(0, 7)
  runtime.add(tree)
  
  const tree2 = new Thing('tree', '🌲', ['blocks'])
  tree2.pos.setXY(7, 6)
  runtime.add(tree2)

  const mtn = new Thing('mountain', '⛰️', ['blocks', 'stops'])
  mtn.pos.setXY(1, 4)
  runtime.add(mtn)
}
