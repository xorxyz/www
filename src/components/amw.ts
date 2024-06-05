import { registerComponent } from "../register";
import Grid from "../lib/xor/grid";
import Runtime from "../lib/xor/runtime";
import { createThing } from "../lib/xor/thing";
import Vector from "../lib/xor/vector";
import { level1, level2, level3, level4, level5 } from "../lib/xor/levels";

const STARTING_LEVEL = 0

const grid = new Grid(8, 8)
const runtime = new Runtime(grid)
const autoplay = false
const thing_types = [
  { name: 'tree', icon: '🌲' }, 
  { name: 'mountain', 'icon': '⛰️'}, 
  { name: 'book', 'icon': '📕' },
  { name: 'sheep', 'icon': '🐑' },
  { name: 'grass', icon: ',,' },
  { name: 'water', icon: '~~' }
]

const dnd = {
  remove_thing(x: number, y: number) {
    runtime.remove_at(new Vector(x, y))
  },
  move_thing(sx: number, sy: number, tx: number, ty: number) {
    runtime.move(new Vector(sx, sy), new Vector(tx, ty))
  },
  add_thing(x: number, y: number, type: string) {
    const thing = createThing(type, x, y)
    runtime.add(thing)
  },
  drop_final(event) {
    const id = event.dataTransfer.getData('text/plain')
    const element = document.getElementById(id);
    if (!element) return
    const x = Number(element.dataset['x'])
    const y = Number(element.dataset['y'])

    this.remove_thing(x, y)
  },
  dragover_final(event) {},
  src: {
    adding: false,
    removing: false,
    drop (event) {
      this.src.removing = false
      const element = document.getElementById(event.dataTransfer.getData('text/plain'));
      console.log('src.drop', element)
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

      const id = event.dataTransfer.getData('text/plain')
      const element = document.getElementById(id);
      if (!element) return

      if (Boolean(element.dataset['thing'])) {
        const type = element.dataset['type']
        
        const target: HTMLElement | null = event.target.closest('.cell');
        if (!target) return

        const tx = Number(target.dataset['x'])
        const ty = Number(target.dataset['y'])
        this.add_thing(tx, ty, type)
        return
      }

      if (Boolean(element.dataset['cell'])) {
        const sx = Number(element.dataset['x'])
        const sy = Number(element.dataset['y'])
      
        const target: HTMLElement | null = event.target.closest('.cell');
        if (!target) return
        const tx = Number(target.dataset['x'])
        const ty = Number(target.dataset['y'])
        this.move_thing(sx, sy, tx, ty)
        return
      }
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
    }
  },
}

registerComponent('amw', ()  => ({
  ...dnd,
  autoplay: autoplay,
  ticks: 0,
  cost: 0,
  size: 0,
  columns: grid.render(),
  runtime: runtime,
  halted: false,
  running: false,
  state: '',
  win: false,
  selected: {
    x: 0,
    y: 0
  },
  border_style: '',
  thing_types: thing_types,
  play_pause_btn_label: 'Play',
  active_level: -1,
  messages: [],
  levels: [
    level1,
    level2,
    level3,
    level4,
    level5
  ],
  load_level(index) {
    index = Number(index)
    if (this.active_level === index) return

    this.set_active_level(index)

    const level = this.get_active_level()

    runtime.clear()
    runtime.load(level)
    runtime.update()

    this.thing_types = thing_types.filter(x => level.components.includes(x.name))
    this.messages = level.messages
  },
  set_active_level(index: number) {
    this.active_level = index
  },
  get_active_level() {
    const level = this.levels[this.active_level]
    return level
  },
  get won() {
    return this.halted && this.win
  },
  get lost() {
    return this.halted && !this.win
  },
  get can_edit() {
    return !(this.ticks !== 0 || this.running)
  },
  select(e) {
    // console.log(e)
  },
  init() {
    this.load_level(STARTING_LEVEL)
    this.runtime.on('tick', ({ ticks }) => { 
      this.ticks = ticks
      this.render()
    })
    this.runtime.on('reset', () => {
      runtime.load(this.get_active_level())
      this.render()
    })
    this.runtime.on('update', () => {
      this.render()
    })
    runtime.load(this.get_active_level())
    this.render()
    if (this.autoplay) {
      this.runtime.start()
    }
  },
  render() {
    this.cost = runtime.cost
    this.size = runtime.size
    this.halted = runtime.is_halted
    this.running = runtime.is_running
    this.win = runtime.has_won
    this.ticks = runtime.get_ticks
    this.state = this.win ? 'Victory' : this.lost ? 'Loss' : this.running ? 'Running' : 'Paused'
    this.columns = grid.render()
    this.play_pause_btn_label = this.runtime.is_running ? 'Pause' : 'Play'
    this.border_style = [
      this.can_edit ? '' : 'cursor-not-allowed',
      this.lost ? 'border-red-500' : '',
      this.won ? 'border-green-500' : ''
    ].filter(x => x).join(' ')
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
