export interface Level {
  id: string,
  title: string,
  task_count: number,
  solves: string[],
  clues: string[]
}

const levels: Level[] = [{
  id: '2024/1', 
  title: 'Albert lost his key',
  task_count: 6,
  solves: ['kavehcpa', 'cdupre'],
  clues: ['bitwise-operations', 'tobaud-encoding', 'snake-cipher']
}]

export default levels
