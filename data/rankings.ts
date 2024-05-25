import levels from './levels'
import { Player, players } from './players'

const scores: Record<string, number> = levels.reduce((obj, { solves }, levelIndex) => {
  const levelMultipler = (levels.length) - levelIndex

  solves.forEach((playerName, index) => { 
    if (!obj[playerName]) obj[playerName] = 0
    if (index === 0) return obj[playerName] += 3
    if (index === 1) return obj[playerName] += 2
    if (index === 2) return obj[playerName] += 1
    const rankMultipler = solves.length - index
    if (index > 2) obj[playerName] += (0.1 * rankMultipler) * levelMultipler
  })
  return obj
}, {})

type PlayerRanking = Player & { score: number }
type Rankings = PlayerRanking[]

let rankings: Rankings = Object.entries(scores)
  .sort(([_, a], [__, b]) => b - a)
  .map(([username, score]) => {
    const player = players.find(p => p.username === username)
    if (!player) throw new Error(`Player "${username}" is not registered.`)
    return {
      ...player, 
      score
    }
  })

if (rankings.length <= 10) {
  const empties: Rankings = (new Array(10 - rankings.length)).fill({ username: 'Nobody', score: 0, joined_on: 'Never', empty: true })
  rankings = [
    ...rankings,
    ...empties
  ]
}

export default rankings
