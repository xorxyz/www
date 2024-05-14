export class Memory {
  readonly size: number

  private values: Array<number>

  constructor (size: number) {
    this.size = size
    this.values = new Array(size).fill(0)
  }

  write(index: number, value: number): boolean {
    if (index < 0 || index > this.size - 1) return false;
    this.values[index] = value
    return true
  }

  read(index: number): number {
    if (index < 0 || index > this.size - 1) return -1;
    return this.values[index]
  }
}
