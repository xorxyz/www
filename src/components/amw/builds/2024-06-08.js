"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/amw.ts
var amw_exports = {};
__export(amw_exports, {
  default: () => amw_default
});
module.exports = __toCommonJS(amw_exports);

// src/lib/xor/vector.ts
var Vector = class _Vector {
  x;
  y;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get label() {
    return `[${this.x.toString(16).toUpperCase()} ${this.y.toString(16).toUpperCase()}]`;
  }
  /** return a new Vector from the give xy object */
  static from(obj) {
    return new _Vector(obj.x, obj.y);
  }
  toObject() {
    return {
      x: this.x,
      y: this.y
    };
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  /** return a new Vector with the same xy */
  clone() {
    return new _Vector(this.x, this.y);
  }
  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  setX(x) {
    this.x = x;
    return this;
  }
  setY(y) {
    this.y = y;
    return this;
  }
  copyX(v) {
    this.x = v.x;
    return this;
  }
  copyY(v) {
    this.y = v.y;
    return this;
  }
  /** set the same xy as a given vector */
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  addX(x) {
    this.x += x;
    return this;
  }
  addY(y) {
    this.y += y;
    return this;
  }
  addXY(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  subX(x) {
    this.x -= x;
    return this;
  }
  subY(y) {
    this.y -= y;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  mul(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  div(v) {
    this.x = this.x / v.x;
    this.y = this.y / v.y;
    if (Number.isNaN(this.x)) this.x = 0;
    if (Number.isNaN(this.y)) this.y = 0;
    return this;
  }
  /* returns true if both vectors have matching x and y values */
  equals(v) {
    return this.x === v.x && this.y === v.y;
  }
  opposes(v) {
    return this.x !== 0 && v.x !== 0 && Math.sign(this.x) !== Math.sign(v.x) || this.y !== 0 && v.y !== 0 && Math.sign(this.y) !== Math.sign(v.y);
  }
  sign() {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    return this;
  }
  absolute() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }
  invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }
};

// src/lib/xor/cell.ts
var Cell = class {
  pos;
  label;
  thing = null;
  output = "..";
  handlers = /* @__PURE__ */ new Set();
  buffer = null;
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.label = `[${this.pos.x},${this.pos.y}]`;
  }
  get is_empty() {
    return this.thing === null;
  }
  has_attribute(attr) {
    if (!this.thing) return false;
    return this.thing.attributes.has(attr);
  }
  put(thing, permanent) {
    thing.pos.copy(this.pos);
    if (permanent) thing.starting_pos.copy(thing.pos);
    this.thing = thing;
  }
  rm() {
    const thing = this.thing;
    this.thing = null;
    return thing;
  }
  updateOutput() {
    this.output = this.thing ? this.thing.render() : "..";
  }
  updateThing() {
    if (this.thing) {
      this.thing.update();
    }
  }
  render() {
    const styles = [
      this.renderFg(),
      this.renderBg(),
      this.renderBorder(),
      this.renderCursor()
    ];
    return {
      id: `${this.pos.x}${this.pos.y}`,
      output: this.output,
      style: styles.filter((x) => x).join(" "),
      x: this.pos.x,
      y: this.pos.y,
      fixed: this.is_empty || this.thing?.fixed || false
    };
  }
  clear() {
    this.thing = null;
    this.buffer = null;
    this.output = "..";
    this.handlers.clear();
  }
  renderFg() {
    if (this.handlers.size > 0) return "text-cyan-900";
    if (!this.thing) return "text-neutral-400";
    if (this.thing.name === "grass") return "text-green-400";
    if (this.thing.name === "water") return "text-blue-100";
    return "";
  }
  renderBg() {
    if (this.handlers.size > 0) return "bg-cyan-400";
    if (!this.thing) return "bg-neutral-900";
    if (this.thing.win) return "bg-green-500";
    if (this.thing.error) return "bg-red-500";
    if (this.thing.name === "wizard") return "bg-purple-900";
    if (this.thing.name === "mountain") return "bg-amber-900";
    if (this.thing.name === "tree") return "bg-green-700";
    if (this.thing.name === "flag") return "bg-yellow-500";
    if (this.thing.name === "grass") return "bg-green-900";
    if (this.thing.name === "water") return "bg-blue-500";
    return "bg-neutral-900";
  }
  renderBorder() {
    if (this.handlers.size > 0) return "border-neutral-600";
    if (!this.thing) return "border-neutral-700";
    if (this.thing.fixed) return "border-violet-100";
    return "border-neutral-700";
  }
  renderCursor() {
    if (!this.thing) return "";
    if (!this.thing.fixed) return "cursor-grab";
    return "";
  }
};

// src/lib/xor/axis.ts
var South = new Vector(0, 1);
var West = new Vector(-1, 0);
var North = new Vector(0, -1);
var East = new Vector(1, 0);
var Axis = class {
  list = [South, West, North, East];
  index = 0;
  get value() {
    return this.list[this.index];
  }
  constructor(dir = South) {
    this.rotate_to(dir);
  }
  rotate_right() {
    this.index = this.index === 3 ? 0 : this.index + 1;
    return this;
  }
  rotate_left() {
    this.index = this.index === 0 ? 3 : this.index - 1;
    return this;
  }
  rotate_to(v) {
    const index = this.list.findIndex((d) => d.equals(v));
    if (index === -1) throw new Error(`Not a valid direction vector.`);
    this.index = index;
    return this;
  }
};

// src/lib/xor/grid.ts
var Grid = class {
  size;
  origin;
  columns;
  cells;
  constructor(w, h) {
    this.size = new Vector(w, h);
    this.columns = new Array(h).fill(0).map((_, x) => new Array(w).fill(0).map((__, y) => new Cell(x, y)));
    this.cells = this.columns.reduce((prev, curr) => [...prev, ...curr], []);
    this.origin = this.columns[0][0];
  }
  out_of_bounds(v) {
    return v.x < 0 || v.x >= this.size.x || v.y < 0 || v.y >= this.size.y;
  }
  move(from, to, permanent) {
    if (this.out_of_bounds(from) || this.out_of_bounds(to)) return false;
    const scell = this.at(from);
    const tcell = this.at(to);
    if (!scell || !tcell) return false;
    if (tcell.is_empty) {
      const thing = scell.rm();
      if (!thing) return false;
      if (scell.buffer) {
        scell.put(scell.buffer, permanent);
        scell.buffer = null;
      }
      tcell.put(thing, permanent);
      this.update_handlers(thing, tcell, scell);
    } else {
      const pthing = tcell.rm();
      if (!pthing) return false;
      if (pthing.fixed) {
        tcell.put(pthing, false);
        return false;
      }
      const thing = scell.rm();
      if (!thing) return false;
      if (thing.fixed) {
        scell.put(thing, false);
        return false;
      }
      scell.put(pthing, permanent);
      tcell.put(thing, permanent);
      this.update_handlers(pthing, scell, tcell);
      this.update_handlers(thing, tcell, scell);
    }
    return true;
  }
  update_handlers(thing, dest_cell, src_cell, prev_dir) {
    if (!thing.attributes.has("walks")) return;
    const next_handle = this.at(dest_cell.pos.clone().add(thing.dir));
    if (next_handle) next_handle.handlers.add(thing);
    if (src_cell) {
      const previous_handle = this.at(src_cell.pos.clone().add(prev_dir || thing.dir));
      if (previous_handle) previous_handle.handlers.delete(thing);
    }
  }
  remove(v) {
    if (this.out_of_bounds(v)) return null;
    const cell = this.at(v);
    if (!cell) return null;
    const thing = cell.rm();
    if (thing) {
      const target = this.at(thing.facing());
      if (target) {
        target.handlers.delete(thing);
      }
    }
    return thing;
  }
  at(v) {
    if (this.out_of_bounds(v)) return null;
    let cell = this.columns[v.x][v.y];
    return cell || null;
  }
  put(thing, v, permanent) {
    const cell = this.at(v);
    if (!cell) return false;
    cell.put(thing, permanent);
    this.update_handlers(thing, cell);
    return true;
  }
  each(fn) {
    this.cells.forEach((cell) => fn(cell));
  }
  render() {
    return this.columns.map((column) => column.map((cell) => cell.render()));
  }
  clear() {
    this.each((cell) => cell.clear());
  }
  list_linear_cells(v, dir) {
    if (this.out_of_bounds(v)) return [];
    const origin = this.at(v);
    if (!origin) return [];
    const result = [];
    const next_pos = origin.pos.clone().add(dir);
    while (!this.out_of_bounds(next_pos)) {
      const next_cell = this.at(next_pos);
      if (!next_cell) break;
      result.push(next_cell);
      next_pos.add(dir);
    }
    return result;
  }
  list_orthogonal_cells(v, dir = South) {
    if (this.out_of_bounds(v)) return [[]];
    const axis = new Axis();
    axis.rotate_to(dir);
    return [
      this.list_linear_cells(v, dir),
      this.list_linear_cells(v, axis.rotate_right().value),
      this.list_linear_cells(v, axis.rotate_right().value),
      this.list_linear_cells(v, axis.rotate_right().value)
    ];
  }
};

// src/lib/xor/clock.ts
var Clock = class {
  callback;
  expectedMs = 0;
  msInterval;
  timeout;
  _running = false;
  _tick = 0;
  constructor(msInterval, callback) {
    this.msInterval = msInterval;
    this.callback = callback;
  }
  get isRunning() {
    return this._running;
  }
  get tick() {
    return this._tick;
  }
  start() {
    this.expectedMs = Date.now() + this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval);
    this._running = true;
  }
  stop() {
    clearTimeout(this.timeout);
    this._running = false;
  }
  step() {
    if (!this._running) return;
    this._tick += 1;
    const drift = Date.now() - this.expectedMs;
    this.callback();
    if (drift > this.msInterval) {
      console.warn("Clock: Something unexpected happened");
    }
    this.expectedMs += this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval - drift);
  }
};

// src/lib/xor/event_bus.ts
var EventBus = class {
  listeners = /* @__PURE__ */ new Map();
  emit(name, data) {
    const listeners = this.listeners.get(name);
    listeners?.forEach((fn) => fn.call(fn, data));
  }
  on(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name)?.push(callback);
  }
};

// src/lib/xor/rectangle.ts
var Rect = class {
  size;
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  get area() {
    return this.width * this.height;
  }
  constructor(size) {
    this.size = size.clone();
  }
};
function get_bounding_rect(vectors) {
  if (!vectors.length) return new Rect(new Vector());
  const top_left = vectors[0].clone();
  const bottom_right = vectors[0].clone();
  vectors.forEach((v) => {
    top_left.setXY(Math.min(top_left.x, v.x), Math.min(top_left.y, v.y));
    bottom_right.setXY(Math.max(bottom_right.x, v.x), Math.max(bottom_right.y, v.y));
  });
  const size = bottom_right.clone().addXY(1, 1).sub(top_left);
  const rect = new Rect(size);
  return rect;
}

// src/lib/xor/runtime.ts
var MS_PER_CYCLE = 400;
var Runtime = class extends EventBus {
  win = false;
  halted = false;
  executing = false;
  ticks = 0;
  clock;
  grid;
  things = /* @__PURE__ */ new Set();
  _size = 0;
  get is_halted() {
    return this.halted;
  }
  get is_running() {
    return this.clock.isRunning || this.executing;
  }
  get get_ticks() {
    return this.ticks;
  }
  get has_won() {
    return this.win;
  }
  get cost() {
    return [...this.things].filter((t) => !t.fixed).length;
  }
  get size() {
    if (this.is_running || this.ticks > 0) return this._size;
    const things = [...this.things].filter((t) => !t.fixed || t.attributes.has("player") || t.attributes.has("win"));
    const rect = get_bounding_rect(things.map((t) => t.pos));
    this._size = rect.area;
    return this._size;
  }
  constructor(grid2) {
    super();
    this.grid = grid2;
    this.clock = new Clock(MS_PER_CYCLE, this.tick.bind(this));
    this.update();
  }
  load(level) {
    level.things.forEach((thing) => {
      const instance = thing.clone();
      instance.fixed = true;
      this.add(instance);
    });
  }
  add(thing) {
    if (!this.grid.at(thing.pos)?.is_empty) return;
    this.things.add(thing);
    this.grid.put(thing, thing.pos, !this.is_running);
    this.update();
  }
  move(from, to) {
    this.grid.move(from, to, !this.is_running);
    this.update();
  }
  remove(thing) {
    this.grid.remove(thing.pos);
    this.things.delete(thing);
    this.update();
  }
  remove_at(v) {
    const thing = this.grid.remove(v);
    if (thing) this.remove(thing);
    this.update();
  }
  start() {
    this.clock.start();
  }
  pause() {
    this.clock.stop();
  }
  clear() {
    this.things = /* @__PURE__ */ new Set();
    this.clock.stop();
    this.grid.clear();
    this.ticks = 0;
    this.halted = false;
    this.win = false;
  }
  reset() {
    const old_state = [...this.things].filter((thing) => !thing.fixed);
    this.clear();
    old_state.forEach((thing) => {
      const instance = thing.reset();
      this.add(instance);
    });
    this.emit("reset");
  }
  step() {
    this.tick();
  }
  halt() {
    this.clock.stop();
    this.halted = true;
    this.update();
  }
  update() {
    this.grid.each((cell) => cell.updateOutput());
    this.emit("update");
  }
  tick() {
    this.executing = true;
    this.emit("update");
    this.things.forEach((thing) => {
      if (this.halted) return false;
      if (thing.attributes.has("walks") && !thing.error) this.handle_walking(thing);
    });
    this.grid.each((cell) => cell.updateThing());
    this.update();
    this.ticks += 1;
    this.executing = false;
    this.emit("tick", { ticks: this.ticks });
  }
  handle_walking(thing) {
    const src = this.grid.at(thing.pos);
    if (!src) return;
    const facing = this.grid.at(thing.facing());
    if (facing && thing.attributes.has("eats") && facing.handlers.has(thing) && facing.has_attribute("edible")) {
      if (thing.attributes.has("eating")) return;
      const edible = facing.rm();
      if (!edible) return;
      const icon = edible.icon;
      thing.attributes.add("eating");
      const EATING_DURATION = 2;
      const GROWTH_DELAY = 5;
      edible.schedule_delayed_effect("eat", EATING_DURATION, () => {
        thing.attributes.delete("eating");
        edible.attributes.delete("edible");
        edible.attributes.delete("attracts");
        edible.icon = "--";
      });
      edible.schedule_delayed_effect("grow", EATING_DURATION + GROWTH_DELAY, () => {
        edible.icon = icon;
        edible.attributes.add("edible");
        edible.attributes.add("attracts");
      });
      facing.put(edible, false);
      return;
    }
    if ([...this.things].some((thing2) => thing2.attributes.has("attracts"))) {
      const changed_dir = this.handle_attraction(thing);
      if (changed_dir) {
        return;
      }
    }
    const dest_pos = thing.pos.clone().add(thing.dir);
    const dest = this.grid.at(dest_pos);
    if (!dest) {
      thing.error = true;
      if (thing.name === "wizard") {
        this.halt();
      }
      return;
    }
    if (dest.has_attribute("blocks")) {
      if (dest.has_attribute("halts")) {
        thing.error = true;
        if (thing.name === "wizard") {
          this.halt();
        }
        return;
      }
      const prev_dir = thing.dir.clone();
      thing.rotate_left();
      this.grid.update_handlers(thing, src, src, prev_dir);
      return;
    }
    const existing_thing = dest.rm();
    if (existing_thing) {
      if (existing_thing.attributes.has("collectible")) {
        if (!thing.attributes.has("player")) {
          dest.buffer = existing_thing;
        }
      } else {
        dest.buffer = existing_thing;
      }
    }
    this.move(thing.pos, dest_pos);
    if (thing.attributes.has("player") && existing_thing && existing_thing.attributes.has("win")) {
      this.win = true;
      thing.win = true;
      this.halt();
      return;
    }
  }
  // - build a list of 4 lists of cells
  // - first is all cells i'm facing, then to my right, behind, and left
  // - iterate over each list
  // - if i encounter something blocking, drop the list
  // - if i encounter something attractive, fixate on it
  // - if i'm facing it, continue
  // - if not, face it, and stop the turn
  handle_attraction(thing) {
    let lines = this.grid.list_orthogonal_cells(thing.pos, thing.dir);
    let done = false;
    let target;
    while (!done) {
      for (let line of lines) {
        const cell = line.shift();
        if (!cell || cell.has_attribute("blocks")) {
          line.length = 0;
          continue;
        }
        if (cell.has_attribute("attracts")) {
          if (thing.name === "wizard" && !cell.has_attribute("attracts:wizard")) continue;
          if (thing.name === "sheep" && !cell.has_attribute("attracts:sheep")) continue;
          done = true;
          target = cell;
          break;
        }
      }
      lines = lines.filter((line) => line.length);
      if (!lines.length) {
        done = true;
      }
    }
    if (target) {
      const prev_dir = thing.dir.clone();
      const distance_vector = target.pos.clone().sub(thing.pos);
      const next_dir = distance_vector.div(distance_vector.clone().absolute());
      if (next_dir.equals(prev_dir)) return false;
      thing.dir.copy(next_dir);
      const cell = this.grid.at(thing.pos);
      this.grid.update_handlers(thing, cell, cell, prev_dir);
      return true;
    } else {
      return false;
    }
  }
};

// src/lib/xor/thing.ts
var Thing = class _Thing {
  win = false;
  error = false;
  fixed = false;
  delayed_effects = /* @__PURE__ */ new Set();
  name;
  icon;
  starting_icon;
  starting_pos = new Vector(0, 0);
  pos = new Vector(0, 0);
  dir = new Vector(0, 1);
  attributes = /* @__PURE__ */ new Set();
  starting_attributes = /* @__PURE__ */ new Set();
  constructor(name, icon, attributes) {
    this.name = name;
    this.icon = icon;
    this.starting_icon = icon;
    attributes.forEach((attr) => this.starting_attributes.add(attr));
    this.starting_attributes.forEach((attr) => this.attributes.add(attr));
  }
  update() {
    if (!this.delayed_effects.size) return;
    this.delayed_effects.forEach((effect) => {
      effect.delay--;
      if (effect.delay <= 0) {
        effect.cb();
        this.delayed_effects.delete(effect);
      }
    });
  }
  render() {
    return this.icon;
  }
  rotate_left() {
    const axis = new Axis(this.dir);
    this.dir.copy(axis.rotate_left().value);
  }
  rotate_right() {
    const axis = new Axis(this.dir);
    this.dir.copy(axis.rotate_right().value);
  }
  clone() {
    const copy = new _Thing(this.name, this.icon, [...this.attributes]);
    copy.pos.copy(this.pos);
    copy.dir.copy(this.dir);
    copy.fixed = this.fixed;
    return copy;
  }
  facing() {
    return this.pos.clone().add(this.dir);
  }
  schedule_delayed_effect(name, delay, cb) {
    this.delayed_effects.add({ name, delay, cb });
  }
  reset() {
    this.error = false;
    this.pos.copy(this.starting_pos);
    this.dir.setXY(0, 1);
    this.icon = this.starting_icon;
    this.attributes.clear();
    this.starting_attributes.forEach((attr) => this.attributes.add(attr));
    this.delayed_effects.clear();
    return this;
  }
};
function createThing(type, x = 0, y = 0) {
  let thing;
  switch (type) {
    case "wizard":
      thing = new Thing("wizard", "\u{1F9D9}\u200D\u2642\uFE0F", ["walks", "blocks", "player"]);
      break;
    case "flag":
      thing = new Thing("flag", "\u{1F6A9}", ["win"]);
      break;
    case "tree":
      thing = new Thing("tree", "\u{1F332}", ["blocks"]);
      break;
    case "mountain":
      thing = new Thing("mountain", "\u26F0\uFE0F", ["blocks", "halts"]);
      break;
    case "book":
      thing = new Thing("book", "\u{1F4D5}", ["attracts", "attracts:wizard", "collectible"]);
      break;
    case "sheep":
      thing = new Thing("sheep", "\u{1F411}", ["walks", "blocks", "eats"]);
      break;
    case "grass":
      thing = new Thing("grass", ",,", ["attracts", "attracts:sheep", "edible"]);
      break;
    case "water":
      thing = new Thing("water", "~~", ["blocks"]);
      break;
    case "value":
      thing = new Thing("value", "01", []);
      break;
    case "scroll":
      thing = new Thing("scroll", "\u{1F4DC}", []);
      break;
    case "candle":
      thing = new Thing("candle", "\u{1F56F}\uFE0F", []);
      break;
    case "castle":
      thing = new Thing("castle", "\u{1F3F0}", []);
      break;
    case "bug":
      thing = new Thing("bug", "\u{1F41B}", []);
      break;
    case "lock":
      thing = new Thing("lock", "\u{1F512}", []);
      break;
    case "key":
      thing = new Thing("key", "\u{1F5DD}\uFE0F", []);
      break;
    case "crown":
      thing = new Thing("lock", "\u{1F451}", []);
      break;
    case "ghost":
      thing = new Thing("ghost", "\u{1F47B}", []);
      break;
    case "snake":
      thing = new Thing("ghost", "\u{1F40D}", []);
      break;
    default:
      throw new Error(`Couldn't create thing of type '${type}'`);
  }
  thing.pos.setXY(x, y);
  return thing;
}

// src/lib/xor/levels.ts
var default_message = [
  `Balthazar wants to reach his goal. Help him by changing the environment. `,
  `Drag and drop trees to place them on the map. You can add as many as you want.`,
  `Hit play to run the simulation. Refresh the page if you need to start over.`
];
var level1 = {
  components: ["tree"],
  things: [
    createThing("wizard", 2, 4),
    createThing("flag", 5, 2),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 0, y + 1)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 7, y + 1))
  ],
  messages: default_message
};
var level2 = {
  components: ["tree"],
  things: [
    createThing("wizard", 2, 4),
    createThing("flag", 5, 2),
    createThing("mountain", 2, 6),
    createThing("mountain", 6, 4),
    ...new Array(4).fill(0).map((_, x) => createThing("mountain", x, 0)),
    ...new Array(3).fill(0).map((_, x) => createThing("mountain", x + 5, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 7)),
    createThing("mountain", 0, 1),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 7, y + 1))
  ],
  messages: default_message
};
var level3 = {
  components: ["tree"],
  things: [
    createThing("wizard", 5, 3),
    createThing("flag", 1, 4),
    createThing("mountain", 5, 1),
    createThing("mountain", 6, 3),
    createThing("mountain", 6, 4),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 7, y + 1))
  ],
  messages: default_message
};
var level4 = {
  components: ["tree"],
  things: [
    createThing("wizard", 5, 3),
    createThing("mountain", 1, 3),
    createThing("flag", 2, 4),
    createThing("mountain", 1, 2),
    createThing("tree", 7, 3),
    createThing("tree", 7, 4),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing("mountain", x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing("mountain", 7, y + 1))
  ],
  messages: default_message
};
var level5 = {
  components: ["tree"],
  things: [
    createThing("wizard", 4, 2),
    createThing("flag", 0, 4),
    createThing("mountain", 2, 2),
    createThing("mountain", 5, 3),
    createThing("mountain", 5, 4),
    createThing("mountain", 7, 5),
    createThing("mountain", 2, 5),
    createThing("mountain", 0, 0),
    createThing("tree", 0, 7),
    ...new Array(3).fill(0).map((_, x) => createThing("tree", x + 3, 0)),
    ...new Array(4).fill(0).map((_, y) => createThing("tree", 7, y + 2))
  ],
  messages: default_message
};

// src/components/amw.ts
var STARTING_LEVEL = 1;
var grid = new Grid(8, 8);
var runtime = new Runtime(grid);
var autoplay = false;
var thing_types = [
  { name: "tree", icon: "\u{1F332}" },
  { name: "mountain", "icon": "\u26F0\uFE0F" },
  { name: "book", "icon": "\u{1F4D5}" },
  { name: "sheep", "icon": "\u{1F411}" },
  { name: "grass", icon: ",," },
  { name: "water", icon: "~~" }
];
var dnd = {
  remove_thing(x, y) {
    runtime.remove_at(new Vector(x, y));
  },
  move_thing(sx, sy, tx, ty) {
    runtime.move(new Vector(sx, sy), new Vector(tx, ty));
  },
  add_thing(x, y, type) {
    const thing = createThing(type, x, y);
    runtime.add(thing);
  },
  drop_final(event) {
    const id = event.dataTransfer.getData("text/plain");
    const element = document.getElementById(id);
    if (!element) return;
    const x = Number(element.dataset["x"]);
    const y = Number(element.dataset["y"]);
    this.remove_thing(x, y);
  },
  dragover_final(event) {
  },
  src: {
    adding: false,
    removing: false,
    drop(event) {
      this.src.removing = false;
      const element = document.getElementById(event.dataTransfer.getData("text/plain"));
      console.log("src.drop", element);
    },
    dragover() {
      this.src.removing = true;
    },
    dragleave() {
      this.src.removing = false;
    },
    dragstart(event) {
      this.src.dragging = true;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", event.target.id);
    },
    dragend() {
      this.src.removing = false;
    }
  },
  dest: {
    adding: false,
    removing: false,
    drop(event) {
      this.dest.adding = false;
      const id = event.dataTransfer.getData("text/plain");
      const element = document.getElementById(id);
      if (!element) return;
      if (Boolean(element.dataset["thing"])) {
        const type = element.dataset["type"];
        const target = event.target.closest(".cell");
        if (!target) return;
        const tx = Number(target.dataset["x"]);
        const ty = Number(target.dataset["y"]);
        this.add_thing(tx, ty, type);
        return;
      }
      if (Boolean(element.dataset["cell"])) {
        const sx = Number(element.dataset["x"]);
        const sy = Number(element.dataset["y"]);
        const target = event.target.closest(".cell");
        if (!target) return;
        const tx = Number(target.dataset["x"]);
        const ty = Number(target.dataset["y"]);
        this.move_thing(sx, sy, tx, ty);
        return;
      }
    },
    dragover() {
      this.dest.adding = true;
    },
    dragleave() {
      this.dest.adding = false;
    },
    dragstart(event) {
      this.dest.dragging = true;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", event.target.id);
      console.log("dragstart", event.target.id);
    },
    dragend(event) {
      this.dest.removing = false;
    }
  }
};
var amw_default = () => ({
  ...dnd,
  autoplay,
  ticks: 0,
  cost: 0,
  size: 0,
  columns: grid.render(),
  runtime,
  halted: false,
  running: false,
  state: "",
  win: false,
  selected: {
    x: 0,
    y: 0
  },
  border_style: "",
  thing_types,
  play_pause_btn_label: "Play",
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
    index = Number(index);
    if (this.active_level === index) return;
    this.set_active_level(index);
    const level = this.get_active_level();
    runtime.clear();
    runtime.load(level);
    runtime.update();
    this.thing_types = thing_types.filter((x) => level.components.includes(x.name));
    this.messages = level.messages;
  },
  set_active_level(index) {
    this.active_level = index;
  },
  get_active_level() {
    const level = this.levels[this.active_level];
    return level;
  },
  get won() {
    return this.halted && this.win;
  },
  get lost() {
    return this.halted && !this.win;
  },
  get can_edit() {
    return !(this.ticks !== 0 || this.running);
  },
  select(e) {
  },
  init() {
    this.load_level(STARTING_LEVEL - 1);
    this.runtime.on("tick", ({ ticks }) => {
      this.ticks = ticks;
      this.render();
    });
    this.runtime.on("reset", () => {
      runtime.load(this.get_active_level());
      this.render();
    });
    this.runtime.on("update", () => {
      this.render();
    });
    runtime.load(this.get_active_level());
    this.render();
    if (this.autoplay) {
      this.runtime.start();
    }
  },
  render() {
    this.cost = runtime.cost;
    this.size = runtime.size;
    this.halted = runtime.is_halted;
    this.running = runtime.is_running;
    this.win = runtime.has_won;
    this.ticks = runtime.get_ticks;
    this.state = this.win ? "Victory" : this.lost ? "Loss" : this.running ? "Running" : "Paused";
    this.columns = grid.render();
    this.play_pause_btn_label = this.runtime.is_running ? "Pause" : "Play";
    this.border_style = [
      this.can_edit ? "" : "cursor-not-allowed",
      this.lost ? "border-red-500" : "",
      this.won ? "border-green-500" : "border-neutral-500"
    ].filter((x) => x).join(" ");
  },
  play_pause() {
    if (runtime.is_running) {
      this.runtime.pause();
    } else {
      this.runtime.tick();
      this.runtime.start();
    }
    this.render();
  },
  step() {
    this.render();
    this.runtime.step();
  },
  reset() {
    this.runtime.reset();
    this.render();
  }
});
