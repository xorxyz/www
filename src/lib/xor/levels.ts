import Thing, { createThing } from "./thing"

export interface Level {
  components: string[],
  things: Thing[],
  messages: string[]
}

export const level1: Level = {
  components: ['tree'],
  things: [
    createThing('wizard', 2, 4),
    createThing('flag', 5, 2),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 0, y + 1)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 7, y + 1))
  ],
  messages: [
  ]
}

export const level2: Level = {
  components: ['tree'],
  things: [
    createThing('wizard', 2, 4),
    createThing('flag', 5, 2),
    createThing('mountain', 2, 6),
    createThing('mountain', 6, 4),
    ...new Array(4).fill(0).map((_, x) => createThing('mountain', x, 0)),
    ...new Array(3).fill(0).map((_, x) => createThing('mountain', x+5, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 7)),
    createThing('mountain', 0, 1),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 7, y + 1))
  ],
  messages: [
  ]
}

export const level3: Level = {
  components: ['tree'],
  things: [
    createThing('wizard', 5, 3),
    createThing('flag', 1, 4),
    createThing('mountain', 5, 1),
    createThing('mountain', 6, 3),
    createThing('mountain', 6, 4),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 7, y + 1))
  ],
  messages: [
  ],
}

export const level4: Level = {
  components: ['tree'],
  things: [
    createThing('wizard', 5, 3),
    createThing('mountain', 1, 3),
    createThing('flag', 2, 4),
    createThing('mountain', 1, 2),
    createThing('tree', 7, 3),
    createThing('tree', 7, 4),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('mountain', x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 0, y + 3)),
    ...new Array(6).fill(0).map((_, y) => createThing('mountain', 7, y + 1))
  ],
  messages: [
  ],
}

export const level5: Level = {
  components: ['tree'],
  things: [
    createThing('wizard', 4, 2),
    createThing('flag', 0, 4),
    createThing('mountain', 2, 2),
    createThing('mountain', 5, 3),
    createThing('mountain', 5, 4),
    createThing('mountain', 7, 5),
    createThing('mountain', 2, 5),
    createThing('mountain', 0, 0),
    createThing('tree', 0, 7),
    ...new Array(3).fill(0).map((_, x) => createThing('tree', x+3, 0)),
    ...new Array(4).fill(0).map((_, y) => createThing('tree', 7, y + 2))
  ],
  messages: [
  ],
}

export const level6: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
}

export const level7: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
}

export const level8: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
}
