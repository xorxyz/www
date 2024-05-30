import { registerComponent } from "../register";
import Grid from "../lib/xor/grid";
import Runtime from "../lib/xor/runtime";
import Thing from "../lib/xor/thing";

const grid = new Grid(8, 8)
const runtime = new Runtime(grid)
const autoplay = false

const dnd = {
  remove_thing(x: number, y: number) {
    const cell = grid.at_xy(x, y)

    if (!cell) return

    const thing = cell.rm()

    if (thing) runtime.remove(thing)

    runtime.update()
    runtime.emit('force_render', {})
  },
  move_thing(sx: number, sy: number, tx: number, ty: number) {
    const scell = grid.at_xy(sx, sy)
    const tcell = grid.at_xy(tx, ty)

    console.log(scell, tcell)
  },
  drop_final(event) {
    console.log('drop_final')
    // this.dest.adding = false
    
    // const is_cell = Boolean(event.target.dataset['cell'])
    // if (!is_cell) return

    // const x = Number(event.target.dataset['x'])
    // const y = Number(event.target.dataset['y'])
    // const cell = grid.at_xy(x, y)
    // if (!cell) return

    const id = event.dataTransfer.getData('text/plain')
    const element = document.getElementById(id);
    if (!element) return
    const x = Number(element.dataset['x'])
    const y = Number(element.dataset['y'])

    this.remove_thing(x, y)

    // console.log('dest.drop', cell, tcell)
  },
  dragover_final(event) {
  },
  src: {
    adding: false,
    removing: false,
    drop (event) {
      this.src.removing = false
      // const target = event.target.closest('div');
      const element = document.getElementById(event.dataTransfer.getData('text/plain'));
      console.log('src.drop', element)
      // target.appendChild(element);
    },
    dragover () {
      this.src.removing = true
    },
    dragleave () {
      this.src.removing = false
    },
    dragstart(event) {
      this.src.dragging = true;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', event.target.id);
    },
    dragend() {
      this.src.removing = false
    }
  },
  dest: {
    adding: false,
    removing: false,
    drop (event) {
      this.dest.adding = false
      console.log('dest_drop')

      
      const id = event.dataTransfer.getData('text/plain')
      const element = document.getElementById(id);
      if (!element) return
      const sx = Number(element.dataset['x'])
      const sy = Number(element.dataset['y'])
    
      const target: HTMLElement | null = event.target.closest('.cell');
      if (!target) return
      const target_child = target.getElementsByTagName('pre')[0]
      if (!target_child) return
      const tx = Number(target_child.dataset['x'])
      const ty = Number(target_child.dataset['y'])
      this.move_thing(sx, sy, tx, ty)
    },
    dragover () {
      this.dest.adding = true
  
    },
    dragleave () {
      this.dest.adding = false
    },
    dragstart(event) {
      this.dest.dragging = true;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', event.target.id);
      console.log('dragstart', event.target.id)
    },
    dragend(event) {
      this.dest.removing = false
      // const target = event.target.closest('div');
    }
  },
}

registerComponent('amw', ()  => ({
  ...dnd,
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
    this.runtime.on('force_render', () => { this.render(); })
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
