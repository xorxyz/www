import { Memory } from './memory'
import { operations } from './constants'

const PAGE_SIZE = 32
const NO_OF_PAGES = 32
const MEMORY_SIZE = NO_OF_PAGES * PAGE_SIZE

export class Machine {
  private memory = new Memory(PAGE_SIZE)
  private ip = 0
  private sp = 0

  loadProgram(data: Array<number>) {
    data.forEach((n, i) => {
      const result = this.memory.write(i, n)
      if (!result) throw new Error(`Could not load data '${n}' at index '${i}'`)
    })
  }

  stackPop(): number {
    const value = this.memory.read(this.sp)
    this.memory.write(this.sp, 0)
    this.sp++
    return value
  }

  stackPush(value: number) {
    this.sp--
    this.memory.write(this.sp, value)
  }

  stackPeek(): number {
    return this.memory.read(this.sp)
  }

  fetch(): number {
    const opCode = this.memory.read(this.ip)

    this.ip++

    return opCode
  }

  exec() {
    const opcode = this.fetch()
    const name = operations[opcode] || 'invalid'
    const fn = this[`_${name}`]
    
    if (!fn) throw new Error('Unknown op code.');
    fn()
  }

  private _jmp() {
    const destinationAddress = this.stackPop()
    this.ip = destinationAddress
  }

  private _jnz() {
    const c = this.stackPop()
    const b = this.stackPop()
    const a = this.stackPop()

    const destinationAddress = a !== 0 ? b : c

    this.stackPush(destinationAddress)
    this._jmp()
  }

  private _sv() {
    const data = this.stackPop()
    const destination = this.stackPop()
    this.memory.write(destination, data)
  }

  private _ld() {
    const source = this.stackPop()
    const data = this.memory.read(source)
    this.stackPush(data)
  }

  private _psh() {
    this.stackPush(this.fetch())
  }

  private _pop() {
    this.stackPop()
  }

  private _dup() {
    this.stackPush(this.stackPeek())
  }

  private _swp() {
    const b = this.stackPop()
    const a = this.stackPop()

    this.stackPush(b)
    this.stackPush(a)
  }

  private _and() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a & b)
  }

  private _not() {
    const x = this.stackPop()
    this.stackPush(~x)
  }

  private _or() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a | b)
  }

  private _xor() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a ^ b)
  }

  private _lsh() {
    const x = this.stackPop()
    this.stackPush(x << 1)
  }

  private _rsh() {
    const x = this.stackPop()
    this.stackPush(x >>> 1)
  }

  private _eq() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a == b ? 1 : 0)
  }

  private _grt() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a > b ? 1 : 0)
  }

  private _lsr() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a < b ? 1 : 0)
  }

  private _add() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a + b)
  }

  private _sub() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a - b)
  }

  private _mul() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a * b)
  }

  private _div() {
    const b = this.stackPop()
    const a = this.stackPop()
    const result = a / b
    if (result == Infinity) {
      this.stackPush(0)
    } else {
      this.stackPush(result)
    }
  }

  private _mod() {
    const b = this.stackPop()
    const a = this.stackPop()
    this.stackPush(a % b)
  }
}
