import { registerComponent } from "../register";

const block_types = ['mem_cell', 'xor', 'input'] as const
type BlockType = typeof block_types[number]

interface Block {
  id: number,
  value: number | '-',
  type: BlockType,
  out: number[]
  in: number[]
}

registerComponent('dropdown', (o) => ({
  open: o,
  close() {
    this.open = false
  },
  click() {
    this.open = !this.open
  }
}))

registerComponent('circuit_builder', () => ({
  init() {
    (new Array(5)).fill(0).forEach((_, index) => {
      this.block_type = 'mem_cell'
      const block = this.add('mem_cell')
      block.out = index + 2 > 5 ? [1] : [index + 2]
      block.value = 1
    })
    this.block_type = 'mem_cell'
  },
  id_counter: 1,
  tick: 0,
  blocks: [],
  block_types,
  block_type: '',
  mem_cells: [],
  update() {
    // disconnect blocks whose outputs don't exists anymore
    const ids = this.blocks.map(b => b.id)
    this.blocks.forEach(block => {
      block.out = block.out.filter(out => ids.includes(Number(out)))
    })

    // update the mem cell list
    this.mem_cells = this.blocks.filter(b => b.type === 'mem_cell')

  },
  add() {
    const block = {
      id: this.id_counter++,
      type: this.block_type,
      in: [],
      value: this.block_type ? 0 : '-',
      out: []
    }

    this.blocks.push(block)
    this.block_type = ''
    this.update()
    return block
  },
  remove(id) {
    const blocks = this.blocks as Block[]
    blocks.splice(blocks.findIndex(b => b.id == id), 1)
    this.update()
  },
  step() {
    this.tick += 1

    const blocks = this.blocks as Block[]
    const previousValues: Record<string, number> = blocks.reduce((prev, curr) => ({ 
      ...prev, 
      [curr.id]: curr.value
    }), {})

    const tapped = new Set<number>

    // shift mem cell values
    const cells = blocks.filter(block => block.type === 'mem_cell')
    cells.forEach((inputBlock) => {
      const outputBlocks = blocks.filter(b => inputBlock.out.includes(b.id))
      if (outputBlocks) {
        outputBlocks.forEach(outputBlock => {
          console.log('Moving', inputBlock.id, 'into', outputBlock.id)
          if (outputBlock.type === 'xor') {
            outputBlock.in.push(previousValues[inputBlock.id])
          } else {
            outputBlock.value = previousValues[inputBlock.id]
            tapped.add(outputBlock.id)
          }
        })
      }
    })

    // apply gates
    const gates = blocks.filter(block => block.type === 'xor')
    gates.forEach(gate => {
      const outputBlock = blocks.find(b => b.id === Number(gate.out))
      if (outputBlock) {
        if (gate.type === 'xor') {
          const result = gate.in.reduce((prev, curr, i) => i === 0 ? curr : prev ^ curr, 0)
          tapped.add(outputBlock.id)
          outputBlock.value = result
        }
      }
    })

    // empty the untapped blocks that have an output
    blocks
      .filter(({id, out}) => !tapped.has(id) && blocks.some(b => b.id === Number(out)))
      .forEach(b => {
        console.log(b) 
        b.value = 0;
      })

    this.update()
  },
  reset() {
    this.tick = 0
    this.update()
  }
}))
