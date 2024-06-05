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
    createThing('flag', 5, 3),
    ...new Array(8).fill(0).map((_, x) => createThing('water', x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('water', x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing('water', 0, y + 1)),
    ...new Array(6).fill(0).map((_, y) => createThing('water', 7, y + 1))
  ],
  messages: [
    'The wizard wants to reach his goals.'
  ]
}

export const level2: Level = {
  components: [],
  messages: [],
  things: [
    createThing('wizard', 2, 4),
    createThing('flag', 5, 3),
    ...new Array(8).fill(0).map((_, x) => createThing('water', x, 0)),
    ...new Array(8).fill(0).map((_, x) => createThing('water', x, 7)),
    ...new Array(6).fill(0).map((_, y) => createThing('water', 0, y + 1)),
    ...new Array(6).fill(0).map((_, y) => createThing('water', 7, y + 1))
  ],
}

export const level3: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
}

export const level4: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
}

export const level5: Level = {
  components: [],
  messages: [],
  things: [
    // createThing('wizard', 0, 0),
    // createThing('flag', 7, 7)
  ]
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
