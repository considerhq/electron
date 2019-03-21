import { EventEmitter } from 'events'

/**
* Creates a lazy instance of modules that can't be required before the
* app 'ready' event by returning a proxy object to mitigate side effects
* on 'require'
*
* @param {Function} creator - Function that creates a new module instance
* @param {PrototypeHolder} holder - the object holding the module prototype
* @param {Boolean} isEventEmitter - whether or not the module is an EventEmitter
* @returns {Object} - a proxy object for the
*/

type Module<T, B> = B extends true ? EventEmitter & T : T;

export function createLazyInstance <T, B extends boolean> (
  creator: (() => T),
  holder: new () => T,
  isEventEmitter: B
): Module<T, B> {
  let lazyModule: T
  const module: any = {}
  for (const method in holder.prototype as (keyof T)[]) {
    module[method] = (...args: any) => {
      if (!lazyModule) {
        // create instance on function at use-time
        lazyModule = creator() as any
        if (isEventEmitter) {
          EventEmitter.call(lazyModule as any)
        }
      }
      return (lazyModule as any)[method](...args)
    }
  }
  return module
}
