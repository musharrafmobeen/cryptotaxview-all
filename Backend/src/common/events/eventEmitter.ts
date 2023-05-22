import { EventEmitter } from 'events';
const eventEmitter = new EventEmitter();

export const events = {
  eventOn: (myFunc) => eventEmitter.on('notify', myFunc),
  eventOnStart: (myFunc) => eventEmitter.on('notifyStart', myFunc),
  eventOnFailed: (myFunc) => eventEmitter.on('failed', myFunc),
  eventFailed: () => eventEmitter.emit('failed'),
  eventEmit: () => eventEmitter.emit('notify'),
  startEventEmit: () => eventEmitter.emit('notifyStart'),
};
