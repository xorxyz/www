export type LevelThing = [string, number, number]

export interface Level {
  components: string[],
  things: LevelThing[],
  messages: string[],
  width?: number
  height?: number
}

const Arr = (x: number): number[] => new Array(x).fill(0)
const h_line = (t: string, y: number, x1: number, x2: number) => Arr(x2+ 1 - x1).map((_, x): LevelThing => [t, x + x1, y])
const v_line = (t: string, x: number, y1: number, y2: number) => Arr(y2+ 1 - y1).map((_, y): LevelThing => [t, x, y + y1])

const default_message = [
  `Balthazar wants to reach his goal. Help him by changing the environment. `,
  `Drag and drop trees to place them on the map. You can add as many as you want.`,
  `Hit play to run the simulation. Refresh the page if you need to start over.`
]

/*
 *  -- WORLD 1 -- 
 *  =============
 */

export const level1: Level = {
  components: ['tree'],
  things: [
    ['wizard', 2, 4],
    ['flag', 5, 2],
    ...h_line('mountain', 0, 0, 7),
    ...h_line('mountain', 7, 0, 7),
    ...v_line('mountain', 0, 1, 6),
    ...v_line('mountain', 7, 1, 6)
  ],
  messages: default_message
}

export const level2: Level = {
  components: ['tree'],
  things: [
    ['wizard', 2, 4],
    ['flag', 5, 2],
    ['mountain', 0, 1],
    ['mountain', 2, 6],
    ['mountain', 6, 4],
    ...h_line('mountain', 0, 0, 3),
    ...h_line('mountain', 0, 5, 7),
    ...h_line('mountain', 7, 0, 7),
    ...v_line('mountain', 0, 3, 7),
    ...v_line('mountain', 7, 1, 6)
  ],
  messages: default_message
}

export const level3: Level = {
  components: ['tree'],
  things: [
    ['wizard', 5, 3],
    ['mountain', 1, 3],
    ['flag', 2, 4],
    ['mountain', 1, 2],
    ['tree', 7, 3],
    ['tree', 7, 4],
    ...h_line('mountain', 0, 0, 7),
    ...h_line('mountain', 7, 0, 7),
    ...v_line('mountain', 0, 3, 6),
    ...v_line('mountain', 7, 1, 2),
    ...v_line('mountain', 7, 5, 6),
  ],
  messages: default_message
}

export const level4: Level = {
  components: ['tree'],
  things: [
    ['wizard', 4, 2],
    ['flag', 0, 4],
    ['mountain', 2, 2],
    ['mountain', 5, 3],
    ['mountain', 5, 4],
    ['mountain', 7, 5],
    ['mountain', 2, 5],
    ['mountain', 7, 2],
    ['mountain', 5, 0],
    ['tree', 0, 7],
    ...h_line('mountain', 0, 0, 2),
    ...h_line('tree', 0, 3, 4),
    ...v_line('tree', 7, 3, 4)
  ],
  messages: default_message
}

export const level5: Level = {
  components: ['tree'],
  things: [
    ['wizard', 5, 3],
    ['flag', 1, 4],
    ['mountain', 5, 1],
    ['mountain', 6, 3],
    ['mountain', 6, 4],
    ...h_line('mountain', 0, 0, 7),
    ...h_line('mountain', 7, 0, 7),
    ...v_line('mountain', 0, 3, 6),
    ...v_line('mountain', 7, 1, 6),
  ],
  messages: default_message
}


export const level6: Level = {
  width: 16,
  height: 9,
  components: ['tree', 'mountain'],
  things: [
    ['wizard', 5, 2],
    ['flag', 6, 5],
    ['mountain', 5, 6],
    ...h_line('mountain', 0, 1, 4),
    ...v_line('mountain', 0, 1, 4)
  ],
  messages: default_message
}

export const level7: Level = {
  components: ['tree'],
  things: [
    ['wizard', 5, 3],
    ['flag', 1, 4],
  ],
  messages: default_message
}

/*
 *  -- WORLD 2 -- 
 *  =============
 */

export const level8: Level = {
  components: [],
  things: [
  ],
  messages: default_message,
}

export const level9: Level = {
  components: [],
  things: [
  ],
  messages: default_message,
}

export const level10: Level = {
  components: [],
  things: [
  ],
  messages: default_message,
}
