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
},{
  id: '2024/2', 
  title: 'A modest wizard',
  task_count: 1,
  solves: ['mayday2000'],
  clues: []
}]

export default levels
