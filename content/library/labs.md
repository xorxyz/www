---
title: Labs
---

A lab is an instance of an [area](areas).

- Labs are like little state-machines.
- Challenges in labs have a flag that is reset 
everytime the state of the lab changes.
- Using given system calls with arguments trigger events.
- The lab state changes when certain conditions are met.
- Labs are closed 5 minutes after all players leave.
- Players who are idle for more then 30 minutes are disconnected,
making them leave the lab they were in

### State Graph


### Checkpoints

A snapshot is taken when you trigger a condition.
This way, the lab can be reset to a given state.


### Reset

