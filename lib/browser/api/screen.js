'use strict'

const { EventEmitter } = require('events')
const { Screen, createScreen } = process.electronBinding('screen')

// Screen is an EventEmitter.
Object.setPrototypeOf(Screen.prototype, EventEmitter.prototype)

let lazyScreen
const screen = {}
for (const method in Screen.prototype) {
  screen[method] = (...args) => {
    if (!lazyScreen) {
      lazyScreen = createScreen()
      EventEmitter.call(lazyScreen)
    }
    return lazyScreen[method](...args)
  }
}

module.exports = screen
