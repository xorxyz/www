import { registerComponent } from "../register";

const block_types = ['mem_cell', 'xor', 'input'] as const

interface Block {
  id: number,
  value: number | '-',
  type: typeof block_types,
  out: undefined | number
}

registerComponent('circuit_builder', () => ({
  init() {
    (new Array(5)).fill(0).forEach(() => this.add())
    this.blocks[4].value = 1
    this.blocks[0].out = "2"
    this.blocks[1].out = "3"
    this.blocks[2].out = "4"
    this.blocks[3].out = "5"
    this.blocks[4].out = "1"
  },
  id_counter: 1,
  tick: 0,
  blocks: [],
  block_types,
  block_type: 'mem_cell',
  mem_cells: [],
  update() {
    // disconnect blocks whose outputs don't exists anymore
    const ids = this.blocks.map(b => b.id)
    this.blocks.forEach(block => {
      if (!ids.includes(Number(block.out))) {
        block.out = 0
      }
    })

    // update the mem cell list
    this.mem_cells = this.blocks.filter(b => b.type === 'mem_cell')

  },
  add() {
    const block = {
      type: this.block_type,
      value: this.block_type === 'mem_cell' ? 0 : '-',
      id: this.id_counter++
    }

    this.blocks.push(block)
    this.update()
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

    const tapped: number[] = []

    blocks.forEach((inputBlock) => {
      const outputBlock = blocks.find(b => b.id === Number(inputBlock.out))
      if (outputBlock) {
        outputBlock.value = previousValues[inputBlock.id]
        tapped.push(outputBlock.id)
      }
    })

    // empty the untapped blocks that have an output
    blocks
      .filter(({id, out}) => !tapped.includes(id) && blocks.find(b => b.id === Number(out)))
      .forEach(b => { b.value = 0; })

    this.update()
  },
  reset() {
    this.tick = 0
    this.update()
  }
}))
