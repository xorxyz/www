import Alpine from 'alpinejs'
import { tokenize } from '../lib/tokenization'

const constantType = { name: 'constant', icon: '#' }
const refType = { name: 'pointer', icon: '&' }
const derefType = { name: 'deref', icon: '*' }
const operationType = { name: 'op', icon: '>' }
const types = [operationType, constantType, refType, derefType]
const operations = ['nop', 'hlt', 'jmp', 'dup', 'out']

const code = tokenize(`
  start:
    @0
  loop:
    out
    #1
    add
    &start
    jmp
`)

console.log(code)

document.addEventListener('alpine:init', () => {
  Alpine.data('editor', () => ({
    types,
    operations,
    code,
    step,
    reset,
    add,
    remove,
    up,
    down,
    changeType,
    output: [],
    tick: 0,
  }));
})

function step() {
  this.tick++
}

function reset() {
  this.tick = 0
}
function add(type) {
  const line = { type: type.icon, value: 0 }
  if (type.icon === '&') line.value = 'start'
  if (type.icon === '*') line.value = 'start'
  if (type.icon === '>') line.value = 'nop'
  this.code.push(line)
}

function remove(line) {
  const index = this.code.findIndex(l => l === line)
  this.code.splice(index, 1)
}

function up(line) {
  const index = this.code.findIndex(l => l === line)
  if (index === 0) return
  var top = this.code[index - 1]
  this.code[index - 1] = this.code[index]
  this.code[index] = top
}

function down(line) {
  const index = this.code.findIndex(l => l === line)
  if (index >= this.code.length - 1) return
  var bottom = this.code[index + 1]
  this.code[index + 1] = this.code[index]
  this.code[index] = bottom
}

function changeType (line, type) {
  line.type = type.icon
  if (type.icon === '&') line.value = 'start'
  if (type.icon === '*') line.value = 'start'
  if (type.icon === '>') line.value = 'nop'
  if (type.icon === '#') line.value = 0
}
